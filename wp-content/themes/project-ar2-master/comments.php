<?php
/**
 * AR2's comments template.
 *
 * @package AR2
 * @since 1.0
 */
?>

<?php if ( post_password_required() ) : ?>
	<div id="comments" class="comments">
		<h3 class="module-title"><?php _e('Password Required', 'ar2') ?></h3>
		<p class="nocomments"><?php _e( 'This post is password protected. Enter the password to view comments.', 'ar2' ) ?></p>
	</div>
	<?php return; ?>
<?php endif ?>


<!--remove the following comment part, the original one is shown in comments-backup.php. -- Jan 13, 2015-->
