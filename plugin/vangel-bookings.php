<?php
/**
 * Plugin Name: V Angel Bookings
 * Description: Lưu khách đặt lịch / yêu cầu tư vấn từ website V Angel và gửi email báo cho tiệm. Xem tại menu "Khách đặt lịch".
 * Version: 1.1.0
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
			'not_found_in_trash' => 'Thùng rác trống',
			'add_new'       => 'Thêm khách',
			'add_new_item'  => 'Thêm khách mới',
		),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => true,
		'menu_position'   => 3,
		'menu_icon'       => 'dashicons-calendar-alt',
		'supports'        => false,
		'capability_type' => 'post',
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

function vangel_bk_times() {
	return array( '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00' );
}

/* Đã có lịch (chưa xoá) cùng chi nhánh + ngày + giờ + dịch vụ chưa? Trả về ID lịch đó hoặc 0. */
function vangel_bk_slot_taken( $date, $time, $service, $location, $exclude = 0 ) {
	if ( '' === $date || '' === $time || '' === $service ) {
		return 0;
	}
	$q = array(
		'post_type'      => 'va_booking',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 1,
		'fields'         => 'ids',
		'post__not_in'   => $exclude ? array( (int) $exclude ) : array(),
		'meta_query'     => array(
			'relation' => 'AND',
			array( 'key' => '_va_kind', 'value' => 'booking' ),
			array( 'key' => '_va_date', 'value' => $date ),
			array( 'key' => '_va_time', 'value' => $time ),
			array( 'key' => '_va_service', 'value' => $service ),
		),
	);
	if ( '' !== $location ) {
		$q['meta_query'][] = array( 'key' => '_va_location', 'value' => $location );
	}
	$ids = get_posts( $q );
	return $ids ? (int) $ids[0] : 0;
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
	register_rest_route( 'vangel/v1', '/taken', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'vangel_bk_taken',
	) );
} );

/* ?rest_route=/vangel/v1/taken&date=YYYY-MM-DD&location=Springdale&service=... -> các giờ đã kín */
function vangel_bk_taken( WP_REST_Request $req ) {
	$date     = sanitize_text_field( (string) $req->get_param( 'date' ) );
	$location = sanitize_text_field( (string) $req->get_param( 'location' ) );
	$service  = sanitize_text_field( (string) $req->get_param( 'service' ) );
	if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) || '' === $service ) {
		return array( 'taken' => array() );
	}
	$q = array(
		'post_type'      => 'va_booking',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 200,
		'fields'         => 'ids',
		'meta_query'     => array(
			'relation' => 'AND',
			array( 'key' => '_va_kind', 'value' => 'booking' ),
			array( 'key' => '_va_date', 'value' => $date ),
			array( 'key' => '_va_service', 'value' => $service ),
		),
	);
	if ( '' !== $location ) {
		$q['meta_query'][] = array( 'key' => '_va_location', 'value' => $location );
	}
	$times = array();
	foreach ( get_posts( $q ) as $id ) {
		$t = (string) get_post_meta( $id, '_va_time', true );
		if ( '' !== $t ) {
			$times[] = $t;
		}
	}
	$res = rest_ensure_response( array( 'taken' => array_values( array_unique( $times ) ) ) );
	$res->header( 'Cache-Control', 'no-store' );
	return $res;
}

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

	if ( 'booking' === $kind && vangel_bk_slot_taken( $d['date'], $d['time'], $d['service'], $d['location'] ) ) {
		return new WP_Error( 'slot_taken', 'This time is already booked for this service. Please choose another time.', array( 'status' => 409 ) );
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

/* Ô chi tiết khách: xem + sửa mọi thông tin, đổi trạng thái */
add_action( 'add_meta_boxes_va_booking', function () {
	add_meta_box( 'va_detail', 'Thông tin khách', function ( $post ) {
		wp_nonce_field( 'va_status_save', 'va_status_nonce' );
		$m = function ( $k ) use ( $post ) {
			return (string) get_post_meta( $post->ID, '_va_' . $k, true );
		};
		$kind = $m( 'kind' ) ?: 'booking';
		$loc  = $m( 'location' );
		$tm   = $m( 'time' );
		echo '<table class="form-table" style="max-width:760px"><tbody>';
		echo '<tr><th>Loại</th><td><select name="va[kind]"><option value="booking"' . selected( $kind, 'booking', false ) . '>Đặt lịch</option><option value="consult"' . selected( $kind, 'consult', false ) . '>Tư vấn</option></select></td></tr>';
		foreach ( array( 'name' => 'Họ tên', 'phone' => 'Số điện thoại', 'email' => 'Email', 'service' => 'Dịch vụ' ) as $k => $label ) {
			echo '<tr><th><label for="va_' . esc_attr( $k ) . '">' . esc_html( $label ) . '</label></th><td><input class="regular-text" id="va_' . esc_attr( $k ) . '" name="va[' . esc_attr( $k ) . ']" value="' . esc_attr( $m( $k ) ) . '"></td></tr>';
		}
		echo '<tr><th>Chi nhánh</th><td><select name="va[location]">';
		foreach ( array( '', 'Springdale', 'Bentonville' ) as $o ) {
			echo '<option value="' . esc_attr( $o ) . '"' . selected( $loc, $o, false ) . '>' . esc_html( '' === $o ? '—' : $o ) . '</option>';
		}
		if ( '' !== $loc && ! in_array( $loc, array( 'Springdale', 'Bentonville' ), true ) ) {
			echo '<option value="' . esc_attr( $loc ) . '" selected>' . esc_html( $loc ) . '</option>';
		}
		echo '</select></td></tr>';
		echo '<tr><th>Ngày hẹn</th><td><input type="date" name="va[date]" value="' . esc_attr( $m( 'date' ) ) . '"></td></tr>';
		echo '<tr><th>Giờ hẹn</th><td><select name="va[time]"><option value="">—</option>';
		$times = vangel_bk_times();
		if ( '' !== $tm && ! in_array( $tm, $times, true ) ) {
			$times[] = $tm;
		}
		foreach ( $times as $t ) {
			list( $h, $mi ) = array_map( 'intval', explode( ':', $t ) );
			$lab = ( $h % 12 ? $h % 12 : 12 ) . ':' . str_pad( (string) $mi, 2, '0', STR_PAD_LEFT ) . ( $h < 12 ? ' AM' : ' PM' );
			echo '<option value="' . esc_attr( $t ) . '"' . selected( $tm, $t, false ) . '>' . esc_html( $lab ) . '</option>';
		}
		echo '</select></td></tr>';
		echo '<tr><th>Ghi chú / câu hỏi</th><td><textarea class="large-text" rows="3" name="va[message]">' . esc_textarea( $m( 'message' ) ) . '</textarea></td></tr>';
		$s = $m( 'status' ) ?: 'new';
		echo '<tr><th>Trạng thái</th><td><select name="va_status">';
		foreach ( array( 'new' => 'Mới', 'contacted' => 'Đã liên hệ', 'done' => 'Xong' ) as $val => $lab ) {
			echo '<option value="' . esc_attr( $val ) . '"' . selected( $s, $val, false ) . '>' . esc_html( $lab ) . '</option>';
		}
		echo '</select></td></tr>';
		if ( $m( 'page' ) ) {
			echo '<tr><th>Gửi từ trang</th><td>' . esc_html( $m( 'page' ) ) . '</td></tr>';
			$mailed = $m( 'mailed' );
			echo '<tr><th>Email báo</th><td>' . ( 'yes' === $mailed ? 'Đã gửi' : 'Chưa gửi được' ) . '</td></tr>';
		} else {
			echo '<tr><th></th><td><em>Khách do tiệm tự thêm.</em></td></tr>';
		}
		echo '</tbody></table><p>Sửa xong bấm <strong>Update</strong> (hoặc <strong>Publish</strong> khi thêm khách mới) để lưu. Lịch đặt (loại "Đặt lịch") sẽ khoá giờ đó cho cùng dịch vụ trên website.</p>';
	}, 'va_booking', 'normal', 'high' );
} );

/* Tiêu đề tự đặt theo tên khách + dịch vụ */
add_filter( 'wp_insert_post_data', function ( $data, $postarr ) {
	if ( 'va_booking' !== $data['post_type'] || empty( $_POST['va'] ) || ! isset( $_POST['va_status_nonce'] ) ) {
		return $data;
	}
	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['va_status_nonce'] ) ), 'va_status_save' ) ) {
		return $data;
	}
	$va    = wp_unslash( $_POST['va'] );
	$kind  = isset( $va['kind'] ) && 'consult' === $va['kind'] ? 'consult' : 'booking';
	$who   = sanitize_text_field( (string) ( $va['name'] ?? '' ) );
	$who   = '' !== $who ? $who : sanitize_text_field( (string) ( $va['phone'] ?? '' ) );
	$svc   = sanitize_text_field( (string) ( $va['service'] ?? '' ) );
	$data['post_title'] = vangel_bk_kind_label( $kind ) . ' — ' . ( '' !== $who ? $who : 'Khách' ) . ( '' !== $svc ? ' — ' . $svc : '' );
	return $data;
}, 10, 2 );

add_action( 'save_post_va_booking', function ( $id ) {
	if ( ! isset( $_POST['va_status_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['va_status_nonce'] ) ), 'va_status_save' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $id ) || wp_is_post_revision( $id ) ) {
		return;
	}
	$s = isset( $_POST['va_status'] ) ? sanitize_key( wp_unslash( $_POST['va_status'] ) ) : 'new';
	if ( in_array( $s, array( 'new', 'contacted', 'done' ), true ) ) {
		update_post_meta( $id, '_va_status', $s );
	}
	if ( empty( $_POST['va'] ) || ! is_array( $_POST['va'] ) ) {
		return;
	}
	$va = wp_unslash( $_POST['va'] );
	update_post_meta( $id, '_va_kind', isset( $va['kind'] ) && 'consult' === $va['kind'] ? 'consult' : 'booking' );
	foreach ( array( 'name', 'phone', 'service', 'location', 'date', 'time' ) as $k ) {
		update_post_meta( $id, '_va_' . $k, mb_substr( sanitize_text_field( (string) ( $va[ $k ] ?? '' ) ), 0, 200 ) );
	}
	$e = sanitize_email( (string) ( $va['email'] ?? '' ) );
	update_post_meta( $id, '_va_email', is_email( $e ) ? $e : '' );
	update_post_meta( $id, '_va_message', mb_substr( sanitize_textarea_field( (string) ( $va['message'] ?? '' ) ), 0, 2000 ) );
	$dup = vangel_bk_slot_taken( (string) get_post_meta( $id, '_va_date', true ), (string) get_post_meta( $id, '_va_time', true ), (string) get_post_meta( $id, '_va_service', true ), (string) get_post_meta( $id, '_va_location', true ), $id );
	if ( $dup && 'booking' === get_post_meta( $id, '_va_kind', true ) ) {
		set_transient( 'vangel_bk_dup_' . get_current_user_id(), $dup, 60 );
	}
} );

add_action( 'admin_notices', function () {
	$dup = get_transient( 'vangel_bk_dup_' . get_current_user_id() );
	if ( $dup ) {
		delete_transient( 'vangel_bk_dup_' . get_current_user_id() );
		echo '<div class="notice notice-warning"><p>Lưu ý: giờ này đã có khách khác đặt cùng dịch vụ — <a href="' . esc_url( get_edit_post_link( $dup ) ) . '">xem lịch đó</a>.</p></div>';
	}
} );

/* Nút trong danh sách: tiếng Việt, bỏ Quick Edit */
add_filter( 'post_row_actions', function ( $actions, $post ) {
	if ( 'va_booking' !== $post->post_type ) {
		return $actions;
	}
	unset( $actions['inline hide-if-no-js'] );
	$map = array( 'edit' => 'Sửa', 'trash' => 'Xoá', 'untrash' => 'Khôi phục', 'delete' => 'Xoá vĩnh viễn' );
	foreach ( $map as $k => $lab ) {
		if ( isset( $actions[ $k ] ) ) {
			$actions[ $k ] = preg_replace( '/>[^<]*<\/a>$/', '>' . $lab . '</a>', $actions[ $k ] );
		}
	}
	return $actions;
}, 10, 2 );

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
