import { request } from 'umi';

const blobToDataURI = (blob) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function (e) {
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
};

const convertAllImagesToBase64 = (cloned) => {
  const pendingImagesPromises = [];
  const pendingPromisesData = [];

  const images = cloned.getElementsByTagName('img');

  for (let i = 0; i < images.length; i += 1) {
    // First we create an empty promise for each image
    const promise = new Promise((resolve, reject) => {
      pendingPromisesData.push({
        index: i,
        resolve,
        reject,
      });
    });
    // We save the promise for later resolve them
    pendingImagesPromises.push(promise);
  }

  for (let i = 0; i < images.length; i += 1) {
    // We fetch the current image
    if (images[i].src?.startsWith('data:')) {
      const pending = pendingPromisesData.find((p) => p.index === i);
      console.log(pending);
      pending.resolve(images[i].src);
    } else {
      request(images[i].src + '&direct=true', {
        responseType: 'blob',
      })
        .then((data) => {
          const pending = pendingPromisesData.find((p) => p.index === i);

          blobToDataURI(data).then((b) => {
            images[i].src = b;
            // images[i].style.width = '150px';
            // images[i].style.height = '150px';
            // images[i].style.objectFit = 'contain';
            // images[i].style.margin = '2px';
            // console.log(images[i]);
            pending.resolve(b);
          });
        })
        .catch((e) => {
          const pending = pendingPromisesData.find((p) => p.index === i);
          pending.reject(e);
        });
    }
  }

  // This will resolve only when all the promises resolve
  return Promise.all(pendingImagesPromises);
};

export { convertAllImagesToBase64 };
