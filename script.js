document.addEventListener("DOMContentLoaded", () => {
    const inpFile = document.querySelector('.inp-file');
    const chooseImage = document.querySelector('.choose-image');
    const previewImage = document.querySelector('.preview-image img');
    const resetImage = document.querySelector('.reset-image');
    const applyButton = document.querySelector('.apply');
    const saveImage = document.querySelector('.save-image');
    const filterOptions = document.querySelectorAll('.filter .options button');
    const rotateButtons = document.querySelectorAll('.rotate .options button');
    const slider = document.querySelector('.slider input');
    const filterName = document.querySelector('.filter-info .name');
    const filterValue = document.querySelector('.filter-info .value');

    let brightness = 100, contrast = 100, blurs = 0, grayscale = 0, saturate = 100, opacity = 100, rotate = 0, vertical = 1, horizontal = 1;

    function applyFilter() {
        previewImage.style.transform = `rotate(${rotate}deg) scale(${vertical}, ${horizontal})`;
        previewImage.style.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) saturate(${saturate}%) opacity(${opacity}%) blur(${blurs}px)`;
    }

    function resetFilters() {
        brightness = 100;
        contrast = 100;
        blurs = 0;
        grayscale = 0;
        saturate = 100;
        opacity = 100;
        rotate = 0;
        vertical = 1;
        horizontal = 1;
        filterOptions[0].click();
        slider.value = brightness;
        filterValue.textContent = `${brightness}%`;
        applyFilter();
    }

    function handleFileChange() {
        const file = inpFile.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            previewImage.src = url;
        }
    }

    inpFile.addEventListener('change', handleFileChange);
    chooseImage.addEventListener('click', () => inpFile.click());

    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            document.querySelector('.filter .options .active').classList.remove('active');
            option.classList.add('active');
            filterName.textContent = option.textContent;

            switch (option.id) {
                case 'brightness':
                    slider.max = 200;
                    slider.value = brightness;
                    filterValue.textContent = `${brightness}%`;
                    break;
                case 'contrast':
                    slider.max = 200;
                    slider.value = contrast;
                    filterValue.textContent = `${contrast}%`;
                    break;
                case 'blurs':
                    slider.max = 10;
                    slider.value = blurs;
                    filterValue.textContent = `${blurs}`;
                    break;
                case 'grayscale':
                    slider.max = 100;
                    slider.value = grayscale;
                    filterValue.textContent = `${grayscale}%`;
                    break;
                case 'saturate':
                    slider.max = 200;
                    slider.value = saturate;
                    filterValue.textContent = `${saturate}%`;
                    break;
                case 'opacity':
                    slider.max = 100;
                    slider.value = opacity;
                    filterValue.textContent = `${opacity}%`;
                    break;
            }
        });
    });

    slider.addEventListener('input', () => {
        const activeFilter = document.querySelector('.filter .options .active').id;
        const value = slider.value;
        filterValue.textContent = `${value}%`;

        switch (activeFilter) {
            case 'brightness':
                brightness = value;
                break;
            case 'contrast':
                contrast = value;
                break;
            case 'blurs':
                blurs = value;
                break;
            case 'grayscale':
                grayscale = value;
                break;
            case 'saturate':
                saturate = value;
                break;
            case 'opacity':
                opacity = value;
                break;
        }

        applyFilter();
    });

    rotateButtons.forEach(button => {
        button.addEventListener('click', () => {
            switch (button.id) {
                case 'left':
                    rotate -= 90;
                    break;
                case 'right':
                    rotate += 90;
                    break;
                case 'vertical':
                    vertical *= -1;
                    break;
                case 'horizontal':
                    horizontal *= -1;
                    break;
            }
            applyFilter();
        });
    });

    resetImage.addEventListener('click', resetFilters);
    applyButton.addEventListener('click', applyFilter);

    saveImage.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = previewImage.naturalWidth;
        canvas.height = previewImage.naturalHeight;

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) saturate(${saturate}%) opacity(${opacity}%) blur(${blurs}px)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(vertical, horizontal);
        ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        const link = document.createElement('a');
        link.download = 'edited-image.jpg';
        link.href = canvas.toDataURL();
        link.click();
    });

    resetFilters(); // Initialize filters on load
});
