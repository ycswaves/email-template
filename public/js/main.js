var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
};

var $form = $('#form')
var $input = $form.find('input[type="file"]')
var uploaded = false

if (isAdvancedUpload()) {

  $form.addClass('has-advanced-upload')

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault()
    e.stopPropagation()
  })
  .on('dragover dragenter', function() {
    $form.addClass('is-dragover')
  })
  .on('dragleave dragend drop', function() {
    $form.removeClass('is-dragover')
  })
  .on('drop', function(e) {
    var droppedFile = e.originalEvent.dataTransfer.files[0]
    uploaded = droppedFile
    showFileName(droppedFile)
  })
  .on('submit', function(e) {
    e.preventDefault()
    if (uploaded === false) {
      return false
    }

    submitHandle(uploaded)
  })

  $('.js-choose-file').click(function() {
    $input.trigger('click')
  })

  $input.change(function() {
    var file = $input.prop('files')[0]
    showFileName(file)
    uploaded = file
  })

}

function showFileName(file) {
  $('.js-filename').text(file.name)
}

function submitHandle(uploaded) {
  var ajaxData = new FormData()
  ajaxData.append($input.attr('name'), uploaded)
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: $form.attr('action'),
    data: ajaxData,
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {
      window.location = data.redirect
      console.log(data)
    }
  });
  
}