//(English) I define the html elements that I will manipulate in variables for easier access.
//(Turkish) Manipülasyon yapacağım html elementlerini, daha kolay erişmek için değişkenlere tanımlıyorum.
let back_button = document.getElementById("back-button");
let next_button = document.getElementById("next-button");
let copy_button = document.getElementById("copy-button");
let copy_link_area = document.getElementById("copy-link-area");
let photo_area = document.getElementById("photo-area");

//(English) I need cat objects to hold the information of all images. I am creating a constructor cat function for this.
//(Türkçe) Tüm görsellerin bilgilerini tutacak kedi nesnelerine ihtiyacım var. Bunun için yapıcı bir Kedi fonksiyonu oluşturuyorum.
function Cat(counter, id, url) {
  this.counter = counter;
  this.id = id;
  this.url = url;
}

//(English) I need an array to keep all cat objects together. After the application is loaded, I want it to show a new image and add it to the array when the next button is pressed. In this way, it will be possible to return. The "counter" variable holds the object index in the array during navigation.
//(Türkçe) Tüm kedi nesnelerini bir arada tutacak bir diziye ihtiyacım var. Uygulama yüklendikten sonra, ileri tuşuna basıldığında yeni görsel göstermesini ve diziye eklemesini istiyorum. Bu sayede dönmek mümkün olacak. "counter" değişkeni ise gezinme sırasında dizideki obje indisini tutar.
let catList = [];
let counter = 0;

//(English) There are actions that must be performed if the Back button is clicked.
//(Türkçe) Geri butonuna tıklanması durumunda gerçekleşmesi gereken aksiyonlar var.
back_button.addEventListener("click", function () {
  if (counter >= 1) {
    //(English) counter value -1
    //(Türkçe) sayacın değeri -1
    counter--;

    //(English) Retrieving the cat object at the previous index from the array. Assign it to the element in the variable "photo_area". Assigning the url of the object to the "copy_link_area" element.
    //(Türkçe) Diziden bir önceki indisdeki kedi nesnesinin getirilmesi. "photo_area" değişkenindeki elemente atanması. "copy_link_area" elementine objenin url'nin atanması.

    var html = `<img src="` + catList[counter].url + `" alt="Cat Photo">`;
    photo_area.innerHTML = html;
    copy_link_area.innerText = catList[counter].url;
  }

  //(English) If the url of the image is copied, the "copied_to_copy()" function is called to restore the changed "copy_button".
  //(Türkçe) Eğer görselin url'i kopyalandıysa değişen "copy_button" ın eski haline dönmesi için "copied_to_copy()" fonksiyonu çağırılır.
  copied_to_copy();
});

//(English) Clicking "next_button" causes actions similar to "back_button" actions. Unlike "back_button" actions, it adds the responses to the array by sending a request to the api. Changes the html elements.
//(Türkçe) "next_button" tıklanması durumunda, "back_button" aksiyonlarına benzer aksiyonlar gerçekleşir. "back_button" aksiyonlarından farklı olarak, api 'ye istek atarak response ları diziye ekler. Html  elementlerini değiştirir.
next_button.addEventListener("click", function () {
  if (catList.length - 1 > counter) {
    counter++;
    var html = `<img src="` + catList[counter].url + `" alt="Cat Photo">`;
    photo_area.innerHTML = html;
    copy_link_area.innerText = catList[counter].url;
  } else if (catList.length - 1 >= counter) {
    ajax_get(
      "https://api.thecatapi.com/v1/images/search?size=full",
      function (data) {
        var html = `<img src="` + data[0]["url"] + `" alt="Cat Photo">`;
        photo_area.innerHTML = html;
        copy_link_area.innerText = data[0]["url"];
        console.log(data);
        counter++;
        let cat = new Cat(counter, data[0]["id"], data[0]["url"]);
        catList.push(cat);
      }
    );
  }
  copied_to_copy();
});

//(English) A simple function in Vanilla Js (Pure Javascript) that shows the assignment of a get request.
//(Türkçe) Vanilya Js'de ( Saf Javascript) get isteği atan gösteren basit bir fonksiyon.
function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log("responseText:" + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

ajax_get(
  "https://api.thecatapi.com/v1/images/search?size=full",
  function (data) {
    var html =
      `<img id="myphoto" src="` + data[0]["url"] + `" alt="Kedi Resmi">`;
    photo_area.innerHTML = html;
    copy_link_area.innerText = data[0]["url"];
    let cat = new Cat(counter, data[0]["id"], data[0]["url"]);
    catList.push(cat);
  }
);
//(English) A simple function that copies a text in Javascript.
//(Türkçe) Javascriptte bir metni kopyalayı yapan basit bir fonksiyon.
function copyText() {
  navigator.clipboard
    .writeText(copy_link_area.innerText)
    .then(function () {
      copy_to_copied();
    })
    .catch(function (error) {
      console.error("The copy operation failed. ", error);
    });
}

copy_button.addEventListener("click", copyText);

//(English) "copy_button" changes its style and text after clicking.
//(Türkçe) "copy_button" tıklanmasından sonra stilini ve metnini değiştirir.
function copy_to_copied() {
  document.getElementById("copy-button").classList.remove("btn-info");
  document.getElementById("copy-button").classList.add("btn-success");
  document.getElementById("copy-button").innerText = "Copied";
}

function copied_to_copy() {
  document.getElementById("copy-button").classList.remove("btn-success");
  document.getElementById("copy-button").classList.add("btn-info");
  document.getElementById("copy-button").innerText = "Copy";
}
