import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc
} from "firebase/firestore";

import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMgoqYgVK2K7Ri5gRPw7Z7S-yNXBU1kCI",
  authDomain: "jonnevie-s-project-833b2.firebaseapp.com",
  projectId: "jonnevie-s-project-833b2",
  storageBucket: "jonnevie-s-project-833b2.appspot.com",
  messagingSenderId: "704239994862",
  appId: "1:704239994862:web:591e36078a591f0aa8f0ff",
};

//initialise the firebase app
initializeApp(firebaseConfig);

//initialize services
const db = getFirestore();
const auth = getAuth();

//collection ref
const colRef = collection(db, "books");

//queries
const q = query(colRef, orderBy("createdAt"));

//realtime collection data

onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

//adding documemts
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

//deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

//get a single document
const docRef = doc(db, "books", "gbwblhrT1NMuPONAxbDH");

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

//updating a single document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(db, "books", updateForm.id.value);
  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

//signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created:", cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
    //   console.log("user signed out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
  .then((cred)=>{
    // console.log('user logged in:', cred.user)
  })
  .catch((err)=>{
    console.log(err.message)
  })
});


//subscribing to auth changes
onAuthStateChanged(auth, (user)=>{
    console.log('user status changed:' ,user)
})