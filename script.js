const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let photosArray = [];

//Declaring variables for counting number of image loaded and boolean variable that track state when all image is loaded
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

//declaring variable that track state it is first loading of image sequece
let initialLoad = true;

//Unsplash API
let initialCount = 5;
const apiKey = 'gqAY8w8kewhCqvM_8pLQQzZI9Zb4PIdR-CaQ0h_3fn4'
let unsplashUrl =`https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

//updating unsplashe URL with new cout query
function updateUnsplashUrl(newCount) {
    unsplashUrl =`https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}`;
}

//Check if all images is loaded
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

//function for seting attributes on created elements
function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

//Create elements for links and photos, and add it to the DOM
function displayPhotos() {
    //seting value of total image loaded and eseting imageLoaded counter
    imagesLoaded = 0;
    totalImages = photosArray.length;
    //create single DOM object from element of photo array
    photosArray.forEach((photo) => {
        //create <a></a> elemant with link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        //create <img> element for each photo
        const image = document.createElement('img');
        setAttributes(image, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });
        //check when each image is loaded
        image.addEventListener('load', imageLoaded);
        //apend image inside <a></a> element
        item.appendChild(image);
        //apend <a></a> element inside image container
        imageContainer.appendChild(item);
    });
}

//get photos from Unsplash API
async function getPhoto() {
    try {
        const response = await fetch(unsplashUrl);
        photosArray = await response.json();
        displayPhotos();
        if(initialLoad) {
            updateUnsplashUrl(30);
            initialLoad = false;
        }
    } catch (error) {
        
    }
}

//Check if scroll is near bottom and load more photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhoto();
        console.log('load more');
    }
});

//on load
getPhoto();