let back_button = document.getElementById("back-button");
let next_button = document.getElementById("next-button");
let copy_button = document.getElementById("copy-button");
let copy_link_area = document.getElementById("copy-link-area");
let photo_area = document.getElementById("photo-area");

function Cat(counter, id, url) {
  this.counter = counter;
  this.id = id;
  this.url = url;
}

let catList = [];
let counter = 0;

back_button.addEventListener("click", function () {
  if (counter >= 1) {
    counter--;
    console.log(catList[counter].url);
    var html = `<img src="` + catList[counter].url + `" alt="Kedi Resmi">`;
    photo_area.innerHTML = html;
    copy_link_area.innerText = catList[counter].url;
  }
  copied_to_copy();
  console.log(counter);
});

next_button.addEventListener("click", function () {
  if (catList.length - 1 > counter) {
    counter++;
    var html = `<img src="` + catList[counter].url + `" alt="Kedi Resmi">`;
    photo_area.innerHTML = html;
    copy_link_area.innerText = catList[counter].url;
  } else if (catList.length - 1 >= counter) {
    ajax_get(
      "https://api.thecatapi.com/v1/images/search?size=full",
      function (data) {
        var html = `<img src="` + data[0]["url"] + `" alt="Kedi Resmi">`;
        photo_area.innerHTML = html;
        copy_link_area.innerText = data[0]["url"];
        console.log(data);
        counter++;
        let cat = new Cat(counter, data[0]["id"], data[0]["url"]);
        catList.push(cat);
        console.log(catList);
        console.log(counter);
      }
    );
  }
  copied_to_copy();
});

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
    console.log(catList);
  }
);

// Kopyalama işlemini gerçekleştirme işlevini tanımlayın
function copyText() {
  navigator.clipboard
    .writeText(copy_link_area.innerText)
    .then(function () {
      copy_to_copied();
    })
    .catch(function (error) {
      console.error("Kopyalama işlemi başarısız oldu: ", error);
    });
}

copy_button.addEventListener("click", copyText);

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
