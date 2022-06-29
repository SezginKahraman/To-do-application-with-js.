let gorevListesi = [];
// görev listesini local storage'da depolardan stringfy etmemiz gerekiyor !!

if (localStorage.getItem("gorevListesi") == null) {
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
} else {
  gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

const txtBox = document.querySelector("#txtTaskName");
const addBtn = document.querySelector("#btnAddNewTask");
const filters = document.querySelectorAll(".filters span");
const ul = document.querySelector("#task-list");

addBtn.addEventListener("click", addTask);
displayTask("all");

for (let span of filters) {
  //filters ı for ile dolaşırsak, her bir döngüde span ı elde ederiz.
  span.addEventListener("click", function () {
    document.querySelector(".filters span.active").classList.remove("active");
    span.classList.add("active");
    displayTask(span.id);
  });
}

function displayTask(filter) {
  ul.innerHTML = "";
  if (gorevListesi.length == 0) {
    ul.innerHTML = `<p>Görev Listeniz Boş !</p>`;
  } else {
    for (let gorev of gorevListesi) {
      if (filter == gorev.durum || filter == "all") {
        let completed = gorev.durum == "completed" ? "checked" : "";

        let li = `<li class="task list-group-item">
    <div class="form-check">
      <input onclick="updateStatus(${gorev.id},this)"
        type="checkbox"
        class="form-check-input"
        name=""
        id="${gorev.id}"
        ${completed}
      />
      <label for="${gorev.id}"  class="${completed} form-check-label">${gorev.gorevAdi}</label>
    </div>
    <!-- dropdown menu  -->
    <div class="dropdown">
      <button
        class="btn btn-link btn-warning dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="fa-solid fa-ellipsis"></i>
      </button>
      <ul
        class="dropdown-menu"
        aria-labelledby="dropdownMenuButton1"
      >
        <li>
          <a
            onclick="deleteTask(${gorev.id})"
            class="dropdown-item"
            href="#"
            ><i class="fa-solid fa-trash-can"></i> Sil</a
          >
        </li>
        <li>
          <a
            onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")'
            class="dropdown-item"
            href="#"
            ><i class="fa-solid fa-pen"></i> Düzenle</a
          >
        </li>
      </ul>
    </div>
  </li>`;
        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}
let editMode = false;
let editedId;

function addTask(e) {
  if (txtBox.value == "") {
    alert("write something to the txt box !!");
  } else {
    if (!editMode) {
      gorevListesi.push({
        id: gorevListesi.length + 1,
        gorevAdi: txtBox.value,
        durum: "pending",
      });
    } else {
      for (let gorev of gorevListesi) {
        if (gorev.id == editedId) {
          gorev.gorevAdi = txtBox.value;
        }
      }
      editMode = false;
      txtBox.value = "";
    }
  }
  e.preventDefault();
  let selectedSpan = document.querySelector(".filters span.active");
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
  displayTask(selectedSpan.id);
}

function deleteTask(id) {
  for (let index in gorevListesi) {
    if (gorevListesi[index].id == id) {
      gorevListesi.splice(index, 1);
    }
  }
  let selectedSpan = document.querySelector(".filters span.active");
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
  displayTask(selectedSpan.id);
}

function editTask(id, name) {
  txtBox.focus();
  editedId = id;
  txtBox.value = name;
  editMode = true;
}

function updateStatus(id, input) {
  // let array = ["pending", "completed"];
  // console.log(id);
  // for (let index in gorevListesi) {
  //   if (gorevListesi[index].id == id) {
  //     console.log(gorevListesi[index].durum);
  //     for (let durumarray of array) {
  //       if (durumarray !== durum) {
  //         console.log(durumarray);
  //         gorevListesi[index].durum = durumarray;
  //       }
  //     }
  //   }
  // }
  console.log(input);

  for (let index in gorevListesi) {
    if (gorevListesi[index].id == id) {
      if (gorevListesi[index].durum == "pending") {
        gorevListesi[index].durum = "completed";
        input.nextElementSibling.classList.add("active");
        console.log(input.nextElementSibling);
        console.log(gorevListesi[index].durum);
      } else {
        gorevListesi[index].durum = "pending";
        console.log(gorevListesi[index].durum);
      }
    }
  }
  let selectedSpan = document.querySelector(".filters span.active");

  displayTask(selectedSpan.id);
}

document.querySelector("#btnClear").addEventListener("click", function (e) {
  gorevListesi.splice(0, gorevListesi.length);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
  let selectedSpan = document.querySelector(".filters span.active");

  displayTask(selectedSpan.id);

  e.preventDefault();
});
