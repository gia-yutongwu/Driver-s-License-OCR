var VISION_URL = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDCj1nB-csJiyGnDpqdVFfnvD2lq5Icd5Y";

        $(document).ready(function() {
          $('#fileform').on('submit', uploadFile);
        });

        function previewFile() {
          var preview = document.querySelector('img');
          var file    = document.querySelector('input[type=file]').files[0];
          var reader  = new FileReader();

          reader.addEventListener("load", function () {
            preview.src = reader.result;
          }, false);

          if (file) {
            reader.readAsDataURL(file);
          }
        }

        function uploadFile(event) {
          $('#results').text('Uploading file...');
          event.preventDefault();

          var file = $('#fileform [name=userFile]')[0].files[0];
          var reader = new FileReader();
          reader.onloadend = processFile;
          reader.readAsDataURL(file);
        }

        function processFile() {
          $('#results').text('Processing file...');
          var content = event.target.result;
          sendFileToCloudVision(content.replace("data:image/jpeg;base64,", ""));
        }

        function sendFileToCloudVision(content) { 
          $('#results').text('Sending file...');

          var type = "TEXT_DETECTION";

          var request = {
            requests: [{
              image: {
                content: content
              },
              features: [{
                type: type,
                maxResults: 200
              }]
            }]
          };

          $('#results').text('Loading...');
          $.post({
            url: VISION_URL,
            data: JSON.stringify(request),
            contentType: 'application/json'
            }).fail(function(jqXHR, textStatus, errorThrown) {
              $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
           }).done(displayJSON);
        }

        function displayJSON(data) {
          var contents = JSON.stringify(data, null, 4);
          $("#results").text(contents);
        }