var gulp = require('gulp');
var shell = require('gulp-shell');

// define tasks here
gulp.task('default', function(){
  // run tasks here
  // set up watch handlers here
});

gulp.task('create-device', shell.task("node create_device_identity.js"));

gulp.task('start-device', shell.task("node simulated_device.js"));

gulp.task('read-device', shell.task("node read_device_to_cloud_messages.js"));

gulp.task('send-message', shell.task("node send_cloud_to_device_message.js"));