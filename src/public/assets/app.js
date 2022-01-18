const uploadArea = document.querySelector('#uploadArea')
const dropZoon = document.querySelector('#dropZoon');
const loadingText = document.querySelector('#loadingText');
const fileInput = document.querySelector('#fileInput');
const previewImage = document.querySelector('#previewImage');
const fileDetails = document.querySelector('#fileDetails');
const uploadedFile = document.querySelector('#uploadedFile');
const uploadedFileInfo = document.querySelector('#uploadedFileInfo');
const uploadedFileName = document.querySelector('.uploaded-file__name');
const uploadedFileIconText = document.querySelector('.uploaded-file__icon-text');
const uploadedFileCounter = document.querySelector('.uploaded-file__counter');
const toolTipData = document.querySelector('.upload-area__tooltip-data');
const imagesTypes = ["jpeg", "png", "svg", "gif"];
toolTipData.innerHTML = [...imagesTypes].join(', .');
dropZoon.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZoon.classList.add('drop-zoon--over');
});
dropZoon.addEventListener('dragleave', function (event) {
    dropZoon.classList.remove('drop-zoon--over');
});
dropZoon.addEventListener('drop', function (event) {
    event.preventDefault();
    dropZoon.classList.remove('drop-zoon--over');
    const file = event.dataTransfer.files[0];
    uploadFile(file);
});
dropZoon.addEventListener('click', function (event) {
    fileInput.click();
});
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    uploadFile(file);
});
function uploadFile(file) {
    const fileReader = new FileReader(); const fileType = file.type; const fileSize = file.size;
    if (fileValidate(fileType, fileSize)) {
        dropZoon.classList.add('drop-zoon--Uploaded');
        loadingText.style.display = "block"; previewImage.style.display = 'none';
        uploadedFile.classList.remove('uploaded-file--open'); uploadedFileInfo.classList.remove('uploaded-file__info--active');
        fileReader.addEventListener('load', function () {
            setTimeout(function () {
                uploadArea.classList.add('upload-area--open');
                loadingText.style.display = "none"; previewImage.style.display = 'block';
                fileDetails.classList.add('file-details--open'); uploadedFile.classList.add('uploaded-file--open'); uploadedFileInfo.classList.add('uploaded-file__info--active');
            }, 500);
            previewImage.setAttribute('src', fileReader.result);
            uploadedFileName.innerHTML = file.name;
            progressMove();
        });
        fileReader.readAsDataURL(file);
    } else { this; };
};
function progressMove() {
    let counter = 0;
    setTimeout(() => {
        let counterIncrease = setInterval(() => {
            if (counter === 100) {
                clearInterval(counterIncrease);
            } else {
                counter = counter + 10; uploadedFileCounter.innerHTML = `${counter}%`
            }
        }, 100);
    }, 600);
}; function fileValidate(fileType, fileSize) {
    let isImage = imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);
    if (isImage[0] === 'jpeg') {
        uploadedFileIconText.innerHTML = 'jpg';
    } else {
        uploadedFileIconText.innerHTML = isImage[0];
    };
    if (isImage.length !== 0) {
        if (fileSize <= 2000000) {
            return true;
        } else {
            return alert('Please Your File Should be 2 Megabytes or Less');
        };
    } else {
        return alert('Please make sure to upload An Image File Type');
    };
};
