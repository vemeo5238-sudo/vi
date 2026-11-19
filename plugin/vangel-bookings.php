<?php
/**
 * Plugin Name: V Angel Bookings
 * Description: Lưu khách đặt lịch / yêu cầu tư vấn từ website V Angel và gửi email báo cho tiệm. Xem tại menu "Khách đặt lịch".
 * Version: 1.0.0
 * Author: V Angel
 * Text Domain: vangel-bookings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const VANGEL_BK_DEFAULT_EMAIL = ''; // email nhan thong bao dat trong trang Cai dat cua plugin

/* ---------- Kiểu dữ liệu "Khách đặt lịch" ---------- */
add_action( 'init', function () {
	register_post_type( 'va_booking', array(
		'labels'          => array(
			'name'          => 'Khách đặt lịch',
			'singular_name' => 'Khách đặt lịch',
			'menu_name'     => 'Khách đặt lịch',
			'all_items'     => 'Tất cả khách',
			'edit_item'     => 'Chi tiết khách',
			'search_items'  => 'Tìm khách',
			'not_found'     => 'Chưa có khách nào',
		),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => true,
		'menu_position'   => 3,
		'menu_icon'       => 'dashicons-calendar-alt',
		'supports'        => array( 'title' ),
		'capability_type' => 'post',
		'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap'    => true,
	) );
} );

function vangel_bk_fields() {
	return array(
		'kind'     => 'Loại',
		'name'     => 'Họ tên',
		'phone'    => 'Số điện thoại',
		'email'    => 'Email',
		'service'  => 'Dịch vụ',
		'location' => 'Chi nhánh',
		'date'     => 'Ngày hẹn',
		'time'     => 'Giờ hẹn',
		'message'  => 'Ghi chú / câu hỏi',
		'page'     => 'Gửi từ trang',
		'ip'       => 'IP',
	);
}

function vangel_bk_kind_label( $k ) {
	return 'consult' === $k ? 'Tư vấn' : 'Đặt lịch';
}

function vangel_bk_email_to() {
	$e = get_option( 'vangel_bk_email', VANGEL_BK_DEFAULT_EMAIL );
	return is_email( $e ) ? $e : get_option( 'admin_email' );
}

/* ---------- Nhận dữ liệu từ website: ?rest_route=/vangel/v1/submit ---------- */
add_action( 'rest_api_init', function () {
	register_rest_route( 'vangel/v1', '/submit', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'vangel_bk_submit',
	) );
} );

function vangel_bk_submit( WP_REST_Request $req ) {
	// Bẫy spam: ô ẩn phải để trống.
	if ( '' !== trim( (string) $req->get_param( '_honey' ) ) ) {
		return array( 'ok' => true );
	}
	// Giới hạn 6 lần gửi / 10 phút cho mỗi IP.
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	$key = 'vangel_bk_rl_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= 6 ) {
		return new WP_Error( 'too_many', 'Too many requests, please call us.', array( 'status' => 429 ) );
	}
	set_transient( $key, $n + 1, 10 * MINUTE_IN_SECONDS );

	$kind = 'consult' === $req->get_param( 'kind' ) ? 'consult' : 'booking';
	$d    = array( 'kind' => $kind, 'ip' => $ip );
	foreach ( array( 'name', 'phone', 'email', 'service', 'location', 'date', 'time', 'page' ) as $f ) {
		$d[ $f ] = mb_substr( sanitize_text_field( (string) $req->get_param( $f ) ), 0, 200 );
	}
	$d['message'] = mb_substr( sanitize_textarea_field( (string) $req->get_param( 'message' ) ), 0, 2000 );
	if ( '' !== $d['email'] && ! is_email( $d['email'] ) ) {
		$d['email'] = '';
	}
	$digits = preg_replace( '/\D/', '', $d['phone'] );
	if ( strlen( $digits ) < 9 || '' === $d['service'] ) {
		return new WP_Error( 'invalid', 'Please enter your phone number and service.', array( 'status' => 400 ) );
	}

	$who   = '' !== $d['name'] ? $d['name'] : $d['phone'];
	$title = vangel_bk_kind_label( $kind ) . ' — ' . $who . ' — ' . $d['service'];
	$id    = wp_insert_post( array(
		'post_type'   => 'va_booking',
		'post_status' => 'publish',
		'post_title'  => $title,
	), true );
	if ( is_wp_error( $id ) ) {
		return new WP_Error( 'save_failed', 'Could not save.', array( 'status' => 500 ) );
	}
	foreach ( $d as $k => $v ) {
		update_post_meta( $id, '_va_' . $k, $v );
	}
	update_post_meta( $id, '_va_status', 'new' );

	// Email báo cho tiệm.
	$labels = vangel_bk_fields();
	$lines  = array();
	foreach ( $labels as $k => $label ) {
		if ( 'ip' === $k || '' === (string) $d[ $k ] ) {
			continue;
		}
		$val     = 'kind' === $k ? vangel_bk_kind_label( $d[ $k ] ) : $d[ $k ];
		$lines[] = $label . ': ' . $val;
	}
	$lines[] = '';
	$lines[] = 'Xem tất cả khách: ' . admin_url( 'edit.php?post_type=va_booking' );
	$headers = array( 'Content-Type: text/plain; charset=UTF-8' );
	if ( '' !== $d['email'] ) {
		$headers[] = 'Reply-To: ' . ( '' !== $d['name'] ? $d['name'] . ' <' . $d['email'] . '>' : $d['email'] );
	}
	$subject = '[V Angel] ' . vangel_bk_kind_label( $kind ) . ' mới: ' . $who . ' — ' . $d['service'];
	$sent    = wp_mail( vangel_bk_email_to(), $subject, implode( "\n", $lines ), $headers );
	update_post_meta( $id, '_va_mailed', $sent ? 'yes' : 'no' );

	return array( 'ok' => true, 'id' => $id );
}

/* ---------- Danh sách trong wp-admin ---------- */
add_filter( 'manage_va_booking_posts_columns', function () {
	return array(
		'cb'          => '<input type="checkbox" />',
		'title'       => 'Khách',
		'va_kind'     => 'Loại',
		'va_phone'    => 'Số điện thoại',
		'va_email'    => 'Email',
		'va_service'  => 'Dịch vụ',
		'va_location' => 'Chi nhánh',
		'va_when'     => 'Ngày giờ hẹn',
		'va_status'   => 'Trạng thái',
		'date'        => 'Gửi lúc',
	);
} );

add_action( 'manage_va_booking_posts_custom_column', function ( $col, $id ) {
	$m = function ( $k ) use ( $id ) {
		return (string) get_post_meta( $id, '_va_' . $k, true );
	};
	switch ( $col ) {
		case 'va_kind':
			echo esc_html( vangel_bk_kind_label( $m( 'kind' ) ) );
			break;
		case 'va_phone':
			$p = $m( 'phone' );
			echo $p ? '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $p ) ) . '">' . esc_html( $p ) . '</a>' : '—';
			break;
		case 'va_email':
			$e = $m( 'email' );
			echo $e ? '<a href="mailto:' . esc_attr( $e ) . '">' . esc_html( $e ) . '</a>' : '—';
			break;
		case 'va_service':
			echo esc_html( $m( 'service' ) ?: '—' );
			break;
		case 'va_location':
			echo esc_html( $m( 'location' ) ?: '—' );
			break;
		case 'va_when':
			echo esc_html( trim( $m( 'date' ) . ' ' . $m( 'time' ) ) ?: '—' );
			break;
		case 'va_status':
			$s   = $m( 'status' ) ?: 'new';
			$map = array( 'new' => array( 'Mới', '#d63638' ), 'contacted' => array( 'Đã liên hệ', '#dba617' ), 'done' => array( 'Xong', '#00a32a' ) );
			$x   = isset( $map[ $s ] ) ? $map[ $s ] : $map['new'];
			echo '<span style="color:' . esc_attr( $x[1] ) . ';font-weight:600">' . esc_html( $x[0] ) . '</span>';
			break;
	}
}, 10, 2 );

/* Ô chi tiết + đổi trạng thái khi mở một khách */
add_action( 'add_meta_boxes_va_booking', function () {
	add_meta_box( 'va_detail', 'Thông tin khách', function ( $post ) {
		wp_nonce_field( 'va_status_save', 'va_status_nonce' );
		echo '<table class="widefat striped" style="max-width:720px">';
		foreach ( vangel_bk_fields() as $k => $label ) {
			$v = (string) get_post_meta( $post->ID, '_va_' . $k, true );
			if ( 'kind' === $k ) {
				$v = vangel_bk_kind_label( $v );
			}
			echo '<tr><th style="width:180px">' . esc_html( $label ) . '</th><td>' . nl2br( esc_html( '' !== $v ? $v : '—' ) ) . '</td></tr>';
		}
		$mailed = get_post_meta( $post->ID, '_va_mailed', true );
		echo '<tr><th>Email báo</th><td>' . ( 'yes' === $mailed ? 'Đã gửi' : 'Chưa gửi được' ) . '</td></tr>';
		echo '</table>';
		$s = get_post_meta( $post->ID, '_va_status', true ) ?: 'new';
		echo '<p><label><strong>Trạng thái:</strong> <select name="va_status">';
		foreach ( array( 'new' => 'Mới', 'contacted' => 'Đã liên hệ', 'done' => 'Xong' ) as $val => $lab ) {
			echo '<option value="' . esc_attr( $val ) . '"' . selected( $s, $val, false ) . '>' . esc_html( $lab ) . '</option>';
		}
		echo '</select></label> — bấm <em>Update</em> để lưu.</p>';
	}, 'va_booking', 'normal', 'high' );
} );

add_action( 'save_post_va_booking', function ( $id ) {
	if ( ! isset( $_POST['va_status_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['va_status_nonce'] ) ), 'va_status_save' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $id ) ) {
		return;
	}
	$s = isset( $_POST['va_status'] ) ? sanitize_key( wp_unslash( $_POST['va_status'] ) ) : 'new';
	if ( in_array( $s, array( 'new', 'contacted', 'done' ), true ) ) {
		update_post_meta( $id, '_va_status', $s );
	}
} );

/* ---------- Trang cài đặt email + tải danh sách CSV ---------- */
add_action( 'admin_menu', function () {
	add_submenu_page( 'edit.php?post_type=va_booking', 'Cài đặt & tải danh sách', 'Cài đặt & tải về', 'manage_options', 'vangel-bk-settings', 'vangel_bk_settings_page' );
} );

function vangel_bk_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	if ( isset( $_POST['vangel_bk_email'] ) && check_admin_referer( 'vangel_bk_settings' ) ) {
		$e = sanitize_email( wp_unslash( $_POST['vangel_bk_email'] ) );
		if ( is_email( $e ) ) {
			update_option( 'vangel_bk_email', $e );
			echo '<div class="updated"><p>Đã lưu email nhận thông báo.</p></div>';
		}
	}
	if ( isset( $_POST['vangel_bk_test'] ) && check_admin_referer( 'vangel_bk_settings' ) ) {
		$ok = wp_mail( vangel_bk_email_to(), '[V Angel] Email thử', "Nếu bạn nhận được email này, thông báo đặt lịch đang hoạt động.\n\n" . admin_url( 'edit.php?post_type=va_booking' ) );
		echo '<div class="' . ( $ok ? 'updated' : 'error' ) . '"><p>' . ( $ok ? 'Đã gửi email thử. Kiểm tra hộp thư (và thư mục Spam).' : 'Máy chủ chưa gửi được email. Nên cài plugin WP Mail SMTP để gửi qua Gmail.' ) . '</p></div>';
	}
	$csv = wp_nonce_url( admin_url( 'admin-post.php?action=vangel_bk_csv' ), 'vangel_bk_csv' );
	echo '<div class="wrap"><h1>Khách đặt lịch — Cài đặt</h1><form method="post">';
	wp_nonce_field( 'vangel_bk_settings' );
	echo '<p><label><strong>Email nhận thông báo:</strong><br><input type="email" name="vangel_bk_email" class="regular-text" value="' . esc_attr( vangel_bk_email_to() ) . '"></label></p>';
	echo '<p><button class="button button-primary">Lưu</button> <button class="button" name="vangel_bk_test" value="1">Gửi email thử</button></p></form>';
	echo '<hr><h2>Tải danh sách khách</h2><p><a class="button button-secondary" href="' . esc_url( $csv ) . '">Tải về file Excel (CSV)</a></p></div>';
}

add_action( 'admin_post_vangel_bk_csv', function () {
	if ( ! current_user_can( 'edit_posts' ) || ! check_admin_referer( 'vangel_bk_csv' ) ) {
		wp_die( 'Not allowed' );
	}
	$posts = get_posts( array( 'post_type' => 'va_booking', 'numberposts' => -1, 'post_status' => 'any' ) );
	nocache_headers();
	header( 'Content-Type: text/csv; charset=UTF-8' );
	header( 'Content-Disposition: attachment; filename=vangel-khach-' . gmdate( 'Y-m-d' ) . '.csv' );
	$out = fopen( 'php://output', 'w' );
	fwrite( $out, "\xEF\xBB\xBF" );
	$fields = vangel_bk_fields();
	unset( $fields['ip'] );
	fputcsv( $out, array_merge( array( 'Gửi lúc' ), array_values( $fields ), array( 'Trạng thái' ) ) );
	foreach ( $posts as $p ) {
		$row = array( get_the_date( 'Y-m-d H:i', $p ) );
		foreach ( array_keys( $fields ) as $k ) {
			$v     = (string) get_post_meta( $p->ID, '_va_' . $k, true );
			$row[] = 'kind' === $k ? vangel_bk_kind_label( $v ) : $v;
		}
		$row[] = get_post_meta( $p->ID, '_va_status', true ) ?: 'new';
		fputcsv( $out, $row );
	}
	fclose( $out );
	exit;
} );
