var socket = io.connect("/");

function resize(img) {
  return 'http://i.embed.ly/?key=dededededededededededededededede&url='+escape(img)+'&width=120&height=80&crop=true';
}

socket.on('response', function(data) {
  console.log(data)
  var preview = data[2][0];
  if (preview.type == 'error') {
    $('#'+data[1]._id).replaceWith('<div><img class="thumbnail" src="images/error.png"/></div>')
  } else {
    $('#'+data[1]._id).replaceWith('<div><div style="clear: both;"></div><h4 class="title"><a href="'+preview.url+'">'+preview.title+'</a></h4><div><a href="'+preview.url+'"><img class="thumbnail" src="'+resize(data[2][0].images[0].url)+'"/></a><p class="description">'+preview.description+'</p></div></div>')
  }
});
socket.on('error', function(data) {
  console.error('A error occurred!')
  console.error(data)
  $('#'+data[1]._id).replaceWith('<div><img class="thumbnail" src="images/error.png"/></div>')
});

socket.on('timeout', function(data) {
  console.error('A timeout occurred!')
  console.error(data)
  $('#'+data[1]._id).replaceWith('<div><img class="thumbnail" src="images/error.png"/></div>')
});

var FORCE=false;
var id = 0;
jQuery(document).ready(function onready($) {
  console.log('ready');
  $('#id_attach').click(function submit_click(ev) {
    id += 1;
    ev.preventDefault();
    $('#feed').prepend('<div id="'+id+'"><img class="thumbnail" src="images/loading-rectangle.gif"/></div>')
    socket.emit('preview', {url: $('#id_url').val(), words: 20, _id: id, force: FORCE});
  });
})

