

/*

/* //OK funzionante
    db.collection("registrazioni").where("hour", "==", "13:23")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        })
    })


db.collection("registrazioni")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            oreIngS.push(doc.data().oraIngMat.toDate());
            //console.log(typeof doc.data().oraIngMat.seconds);
            //console.log(`${doc.id} => ${doc.data()}`);
        });
        try {
            oreIngS.forEach(element => {
                console.log(element.toLocaleDateString(), element.toLocaleTimeString());
                //oreIng.push(toDateTime(Number(element)));
            });
            //console.log(oreIngS[0].toLocaleDateString(),oreIngS[0].toLocaleTimeString());
        } catch (error) {
            console.log(error);
        }

    });

*/
const db = firebase.firestore();

  
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    //tosUrl: '<your-tos-url>',
    // Privacy policy url.
    //privacyPolicyUrl: '<your-privacy-policy-url>'
  };

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

window.onunload = function () {
    firebase.auth()
    .signOut()
    .then(function() {
        // Sign-out successful.
      })
    .catch(function(error) {
        
        // An error happened.
      });
      
};
function logOut(){
    firebase.auth()
    .signOut()
    .catch(function(error) {
        console.log(error);
        // An error happened.
      });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementById("userName").innerHTML = user.displayName +  "</br>Log out";
      // ...
    } else {
      // User is signed out.
      console.log("User logged out");
      document.getElementById("userName").innerHTML = "Log in";
    }
  });

const regs = [
    document.getElementById("timeEntMor"),
    document.getElementById("timeExitMor"),
    document.getElementById("timeEntPom"),
    document.getElementById("timeExitPom")
];
const checks = [
    document.getElementById("checkEntMor"),
    document.getElementById("checkExitMor"),
    document.getElementById("checkEntPom"),
    document.getElementById("checkExitPom"),
];

const dateTimeLabel = document.getElementById("date");
const dataRefreshIcon = document.getElementById("dateRefresh");
var selectedDate;

function dateInit() {
    let date = new Date();
    dateTimeLabel.innerHTML = "Data e ora di oggi: </br>" + date.toLocaleString();
    let dateValues = date.toLocaleDateString().split("/");
    for(let x = 0; x < 3; x++){
        if(dateValues[x].length == 1) dateValues[x] = "0"+ dateValues[x];
    }
    selectedDate = dateValues[2] + "-" + dateValues[1] + "-" + dateValues[0];
    //dateTimeLabel.innerHTML = "Data e ora di oggi: </br>" + date.toISOString();

}
function clockInit() {
    interval = setInterval(dateInit, 1000);
}

function newRegistration(buttonType) {
    let hour = new Date().toTimeString().split(":")[0] + ":" + new Date().toTimeString().split(":")[1]; //Hour in format HH:MM;

    if (buttonType === "enter") {
        if (hour < "15:00:00") {
            regs[0].innerHTML = hour;
            newFieldValue(0);
        } else {
            regs[2].innerHTML = hour;
            newFieldValue(2);
        }
        animationRefresh("regEnt", "buttonClicked");
    }
    if (buttonType === "exit") {
        if (hour < "15:00:00") {
            regs[1].innerHTML = hour;
            newFieldValue(1);
        } else {
            regs[3].innerHTML = hour;
            newFieldValue(3);
        }
        animationRefresh("regExit", "buttonClicked");
    }

    hoursCount();

}
function deleteRow(id) {

    arrayId = numberIns(id.id) - 1; // id.id = binIcon1


    regs[arrayId].innerHTML = "No registration";
    regs[arrayId].style.color = "#e99679";
    checks[arrayId].innerHTML = "clear";
    checks[arrayId].classList.remove("checked");

    hoursCount();

    animationRefresh(regs[arrayId].id, "textShake");
    animationRefresh(id.id, "redBin");

}
function editRowStart(id) {
    editingRow = numberIns(id.id) - 1; // id.id = editIcon1

    document.getElementById("timeInput").value = regs[editingRow].textContent;
    document.getElementById("timeInput").focus()

    document.getElementById("editConfirm").classList.remove("buttonOn");
    document.getElementById("editConfirm").classList.add("buttonOff");

    document.getElementById("popUpEdit").classList.remove("popUpEditOff");
    document.getElementById("popUpEdit").classList.add("popUpEditOn");

    animationRefresh(id.id, "greenEdit");

}
//Funzione richiamata dal cambiamento del valore in input
//disattiva il pulsante di conferma in caso i valori siano fuori limiti
function checkInput(value) {
    let h = Number(value.value.split(":")[0]);
    let m = Number(value.value.split(":")[1]);
    if (h == "NaN" || m == "NaN") {
        document.getElementById("editConfirm").classList.remove("buttonOn");
        document.getElementById("editConfirm").classList.add("buttonOff");
    } else {
        document.getElementById("editConfirm").classList.add("buttonOn");
        document.getElementById("editConfirm").classList.remove("buttonOff");
    }
}
function editRowEnd(button) {

    if (button.id == "editConfirm") {

        animationRefresh("editConfirm", "editConfimClick");

        regs[editingRow].innerHTML = document.getElementById("timeInput").value;
        newFieldValue(editingRow);

        hoursCount();

    } else {
        animationRefresh("editCancel", "editConfimClick");
    }
    document.getElementById("popUpEdit").classList.remove("popUpEditOn");
    document.getElementById("popUpEdit").classList.add("popUpEditOff");
}
//Date management
function editDataStart() {
    document.getElementById("popUpDateEdit").classList.remove("popUpEditOff");
    document.getElementById("popUpDateEdit").classList.add("popUpEditOn");
}
function editDateEnd(button) {
    if (button.id == "editDateConfirm") {
        selectedDate = document.getElementById("dateInput").value;
        dateTimeLabel.innerHTML = "Giornata in visualizzazione : </br>" + selectedDate;

        dataRefreshIcon.classList.remove("dateRefreshOff");
        dataRefreshIcon.classList.add("dateRefreshOn");

        updateDataFromDB(selectedDate);

        clearInterval(interval);
        animationRefresh("editDateConfirm", "editConfimClick");
    } else {
        animationRefresh("editDateCancel", "editConfimClick");
    }
    document.getElementById("popUpDateEdit").classList.remove("popUpEditOn");
    document.getElementById("popUpDateEdit").classList.add("popUpEditOff");
}

function dateRefresh() {
    dataRefreshIcon.classList.add("dateRefreshOff");
    dataRefreshIcon.classList.remove("dateRefreshOn");
    dateInit();
    clockInit();
    updateDataFromDB(selectedDate);
}

function newFieldValue(checkId) {
    regs[checkId].style.color = "white";
    checks[checkId].innerHTML = "check";
    checks[checkId].classList.add("checked");
}

//Funzione conteggio ore totali lavorate
function hoursCount() {
    let hours = []; //0 = ing mattina , 1 = out mattina , 2 = ing pom , 3 = out pom
    let minuts = [];
    let mornHou, pomHou, mornMin, pomMin = 0;
    let minLast, hourLast = 0;
    let valid = false;

    regs.forEach(element => {
        hours.push(Number(element.innerHTML.split(":")[0]))
        minuts.push(Number(element.innerHTML.split(":")[1]))
    });


    for (i = 1; i <= 4; i++) {
        mornMin = minuts[1] - minuts[0];
        pomMin = minuts[3] - minuts[2];
        mornHou = hours[1] - hours[0];
        pomHou = hours[3] - hours[2];
    }
    if (mornHou <= 0 || pomHou <= 0 || hours[2] <= hours[0] || hours[3] <= hours[1]) {
        valid = false;
    } else {
        if (isNaN(mornHou) == true && isNaN(pomHou) == false) {
            hourLast = pomHou;
            minLast = pomMin;
            valid = true;
        }
        if (isNaN(mornHou) == false && isNaN(pomHou) == true) {
            hourLast = mornHou;
            minLast = mornMin;
            valid = true;
        }
        if (isNaN(mornHou) == false && isNaN(pomHou) == false) {
            hourLast = mornHou + pomHou;
            minLast = mornMin + pomMin;
            valid = true;
        }

        if (minLast < 0 && hourLast > 0) {
            hourLast = hourLast - 1;
            minLast = 60 + minLast;
        }
    }


    let text, color;

    if (valid) {
        text = hourLast + ":" + minLast;
        color = "white"

    } else {
        text = "Invalid";
        color = "#fe4c68"
    }

    document.getElementById("timeTotal").innerHTML = text;
    document.getElementById("timeTotal").style.color = color;

    updateDB(selectedDate);

}

function updateDataFromDB(date) {
    console.log("Reading data from : ", date);
    db.collection("registrazioni").doc(date)
        .get()
        .then(function (doc) {
            //console.log(date, doc.data());
            for (let i = 0; i < 4; i++) {
                regs[i].innerHTML = "No registration";
                regs[i].style.color = "#e99679";
                checks[i].innerHTML = "clear";
                checks[i].classList.remove("checked");
            }
            if (doc.exists) {

                regs[0].innerHTML = doc.data().In_mor;
                regs[1].innerHTML = doc.data().Out_mor;
                regs[2].innerHTML = doc.data().In_pom;
                regs[3].innerHTML = doc.data().Out_pom;

                for (let i = 0; i < 4; i++)newFieldValue(i);

                hoursCount();

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");

                document.getElementById("timeTotal").innerHTML = "Invalid";
                document.getElementById("timeTotal").style.color = "#fe4c68";

            }
        })
        .catch(function (error) {
            console.log("Error getting document:", error);
        });

}
function updateDB(date) {

    //try {
    console.log("Updating data  : ", date);
    db.collection("registrazioni").doc(date)
        .update({
            In_mor: regs[0].innerHTML,
            Out_mor: regs[1].innerHTML,
            In_pom: regs[2].innerHTML,
            Out_pom: regs[3].innerHTML
        })
        .then(function () {
            console.log("Document updated");
        })
        .catch(function (error) {
            console.log("Documento non trovato, creo nuovo documento");
            console.log("Creating data  : ", date);

            db.collection("registrazioni").doc(date)
                .set({
                    In_mor: regs[0].innerHTML,
                    Out_mor: regs[1].innerHTML,
                    In_pom: regs[2].innerHTML,
                    Out_pom: regs[3].innerHTML
                })
                .then(function () {
                    console.log("Document created");
                })
                .catch(function (error) {
                    console.error("Errore nella creazione:", error);
                })
        });
}

//Funzione riavvia l'animazione richiesta disattivando la classe e riattivandola
function animationRefresh(id, className) {
    document.getElementById(id).classList.remove(className);
    void document.getElementById(id).offsetWidth;
    document.getElementById(id).classList.add(className);
}
//Funzione ritorna il primo numero all'interno di una stringa
function numberIns(str) {
    return str.match(/\d+/g)[0];
}

function dateNow() {

    let dateNow = new Date().toLocaleDateString().split("/")[2] + "-"
        + new Date().toLocaleDateString().split("/")[1] + "-"
        + new Date().toLocaleDateString().split("/")[0];

    return dateNow;
    //let hourNow = new Date().toISOString().split("T")[1].split(" ")[0] + 2;

}

//Init functions
dateInit();
clockInit();
updateDataFromDB(selectedDate);
