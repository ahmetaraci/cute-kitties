let back_button = document.getElementById("back-button");
let next_button = document.getElementById("next-button");
let download_button = document.getElementById("download-button");
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

  console.log(counter);
});

next_button.addEventListener("click", function () {
  if (catList.length - 1 > counter) {
    counter++;
    var html = `<img src="` + catList[counter].url + `" alt="Kedi Resmi">`;
    photo_area.innerHTML = html;
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
    var html = `<img src="` + data[0]["url"] + `" alt="Kedi Resmi">`;
    photo_area.innerHTML = html;
    copy_link_area.innerText = data[0]["url"];
    let cat = new Cat(counter, data[0]["id"], data[0]["url"]);
    catList.push(cat);
    console.log(catList);
  }
);

download_button.addEventListener("click", function () {
  let download_url = copy_link_area.innerText;
  let anchor = document.createElement("a");
  anchor.href = download_url;
  let url_parts = download_url.split("/");
  let file_name = url_parts[url_parts - 1];
  anchor.download = file_name;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
});

// download_button.addEventListener("click", function () {
//   let download_url = copy_link_area.innerText;
//   fetch(download_url)
//     .then((response) => response.blob())
//     .then((blob) => {
//       var download_url = window.URL.createObjectURL(blob);
//       var a = document.createElement("a");
//       a.style.display = "none";
//       a.href = download_url;

//       let url_parts = download_url.split("/");
//       let file_name = url_parts[url_parts - 1];

//       a.download = file_name;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     });
// });
