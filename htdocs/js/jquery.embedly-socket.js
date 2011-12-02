var socket = io.connect("/");
socket.on('response', function(data) {
  console.log(data)
  var preview = data[2][0];
  if (preview.type == 'error') {
    $('#feed').append('<div><img src="/images/error.png"/></div>')
  } else {
    $('#feed').append('<div><img src="'+data[2][0].images[0].url+'"/></div>')
  }
});
socket.on('error', function(data) {
  console.error('A error occurred!')
  console.error(data)
  $('#feed').append('<div><img src="/images/error.png"/></div>')
});
socket.on('timeout', function(data) {
  console.error('A timeout occurred!')
  console.error(data)
  $('#feed').append('<div><img src="/images/error.png"/></div>')
});
var FORCE=false;
jQuery(document).ready(function onready($) {
  console.log('ready');
  $('#id_submit').click(function submit_click(ev) {
    ev.preventDefault();
    socket.emit('preview', {url: $('#id_status').val(), force: FORCE});
  });
})

