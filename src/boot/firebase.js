import { boot } from 'quasar/wrappers'
import { initializeApp } from "firebase/app";
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";

import { getFirestore, collection, addDoc, query, where, or, and, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import moment from 'moment';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIkEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID,
  measurementId: process.env.VUE_APP_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const gprovider = new GoogleAuthProvider();
const fprovider = new FacebookAuthProvider();
const giprovider = new GithubAuthProvider();
const tprovider = new TwitterAuthProvider();
const mprovider = new OAuthProvider('microsoft.com');


const db = getFirestore(app);

export const firebase = {
  async authUser() {
    return await new Promise(resolve => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({
            success: true,
            user: user
          })
        } else {
          resolve({
            success: false
          })
        }
      });
    })
  },
  async updateUser(displayName, photoURL) {
    return await updateProfile(auth.currentUser, {
      displayName: displayName, photoURL
    }).then(() => {
      return true
    }).catch((error) => {
      console.error(error)
      return false
    });
  },
  async registerEmail(email, passsword) {
    return await createUserWithEmailAndPassword(auth, email, passsword)
      .then(async (userCredential) => {
        const updatedUser = await this.updateUser(userCredential.user.displayName, userCredential.user.photoURL ? userCredential.user.photoURL : '')
        if (updatedUser) {
          return {
            success: true,
            user: userCredential.user
          };
        } else {
          return {
            success: true,
            user: userCredential.user,
            message: "displayName e photoUrl não foram salvos"
          };
        }
      })
      .catch((error) => {
        return {
          success: false,
          error
        }
      });
  },
  async login(email, passsword) {
    return await signInWithEmailAndPassword(auth, email, passsword)
      .then((userCredential) => {
        return {
          success: true,
          user: userCredential.user
        };
      })
      .catch((error) => {
        return {
          success: false,
          error
        }
      });
  },
  async google() {
    return await signInWithPopup(auth, gprovider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const updatedUser = await this.updateUser(user.displayName, user.photoURL ? user.photoURL : '')
        if (updatedUser) {
          return {
            success: true,
            credential,
            token,
            user
          }
        } else {
          return {
            success: true,
            user: userCredential.user,
            message: "displayName e photoUrl não foram salvos"
          };
        }

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return {
          success: false,
          errorCode,
          errorMessage,
          credential
        }
      });
  },
  async facebook() {
    return await signInWithPopup(auth, fprovider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const updatedUser = await this.updateUser(user.displayName, user.photoURL ? user.photoURL : '')
        if (updatedUser) {
          return {
            success: true,
            credential,
            token,
            user
          }
        } else {
          return {
            success: true,
            user: userCredential.user,
            message: "displayName e photoUrl não foram salvos"
          };
        }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return {
          success: false,
          errorCode,
          errorMessage,
          email,
          credential
        }
      });
  },
  async twitter() {
    return await signInWithPopup(auth, tprovider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const updatedUser = await this.updateUser(user.displayName, user.photoURL ? user.photoURL : '')
        if (updatedUser) {
          return {
            success: true,
            credential,
            token,
            user
          }
        } else {
          return {
            success: true,
            user: userCredential.user,
            message: "displayName e photoUrl não foram salvos"
          };
        }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return {
          success: false,
          errorCode,
          errorMessage,
          email,
          credential
        }
      });
  },
  async github() {
    return await signInWithPopup(auth, giprovider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const updatedUser = await this.updateUser(user.displayName, user.photoURL ? user.photoURL : '')
        if (updatedUser) {
          return {
            success: true,
            credential,
            token,
            user
          }
        } else {
          return {
            success: true,
            user: userCredential.user,
            message: "displayName e photoUrl não foram salvos"
          };
        }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return {
          success: false,
          errorCode,
          errorMessage,
          email,
          credential
        }
      });
  },
  async microsoft() {
    return await signInWithPopup(auth, mprovider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = credentialFromResult.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const updatedUser = await this.updateUser(user.displayName, user.photoURL ? user.photoURL : '')
        if (updatedUser) {
          return {
            success: true,
            credential,
            token,
            user
          }
        } else {
          return {
            success: true,
            user: userCredential.user,
            message: "displayName e photoUrl não foram salvos"
          };
        }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        return {
          success: false,
          errorCode,
          errorMessage,
          email,
          credential
        }
      });
  },
  async logout() {
    return await signOut(auth).then(() => {
      window.location = '/'
      return {
        success: true
      }
    }).catch((error) => {
      return {
        success: false
      }
    });
  },
  async resetPassword(email) {
    return await sendPasswordResetEmail(auth, email, {
      url: process.env.VUE_APP_URL + 'login?email=' + email,
    })
      .then(() => {
        return { success: true, message: "Enviamos um link de recuperação para seu email." }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error)
        return { success: false, error }
      });
  },
  async addData(table, data) {
    try {
      const docRef = await addDoc(collection(db, table), data);
      return {
        success: true,
        id: docRef.id
      }
    } catch (e) {
      return {
        success: false,
        error: e
      }
    }
  },
  async getData(table, date, type) {
    try {
      const dateNewFormat = moment(date).endOf('month').format('YYYYMMDD');
      const dateOldFormat = moment(date).startOf('month').format('YYYYMMDD');
      let newdate = parseInt(dateNewFormat, 10);
      let olddate = parseInt(dateOldFormat, 10);


      let data = [];
      const dataRef = collection(db, table);

      const query1 = query(
        dataRef,
        where('type', '==', type),
        where('date', '<=', newdate),
        where('date', '>=', olddate)
      );

      const query2 = query(
        dataRef,
        where('type', '==', type),
        where('repeat', '==', 3),
        where('date', '<=', olddate)
      );

      const [querySnapshot1, querySnapshot2] = await Promise.all([getDocs(query1), getDocs(query2)]);

      const results1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const results2 = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Combine the results, removing duplicates by ID
      const combinedResults = [...results1, ...results2.filter(doc => !results1.some(d => d.id === doc.id))];

      return {
        success: true,
        data: combinedResults
      };
    } catch (e) {
      console.log(e)
      return {
        success: false,
        error: e.toString()
      };
    }
  },
  async updateItem(table, id, data) {
    //atualizar item no firestore 
    try {
      const itemRef = doc(db, table, id);
      await updateDoc(itemRef, data);
      return {
        success: true,
        message: 'Item updated successfully'
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString()
      };
    }
  },
  async deleteData(item, type) {
    try {
      // Obter a referência ao documento específico
      const docRef = doc(db, 'expenses', item.id);

      if (type === 1) {
        // Deletar apenas o item com item.id
        await deleteDoc(docRef);
      } else if (type === 2) {
        // Deletar o item com item.id
        await deleteDoc(docRef);

        // Deletar todos os itens onde parent == item.id

        const dataRef = collection(db, 'expenses');
        const q = query(dataRef, where('parent', '==', item.parent ? item.parent : item.id));
        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref);
        }
        if (item.parent) {
          const parentDocRef = doc(db, 'expenses', item.parent);
          console.log(parentDocRef)
          await deleteDoc(parentDocRef);
        }
      } else if (type === 3) {
        // Deletar o item com item.id
        await deleteDoc(docRef);

        // Deletar todos os itens onde parent == item.id e date >= parseInt(this.config.currentDate, 10)
        const curDate = parseInt(item.date, 10);
        const dataRef = collection(db, 'expenses');
        const q = query(dataRef, where('parent', '==', item.parent ? item.parent : item.id), where('date', '>=', curDate));
        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref);
        }
      }

      return {
        success: true,
        message: 'Expense(s) deleted successfully'
      };
    } catch (e) {
      return {
        success: false,
        error: e.toString()
      };
    }
  }
}


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  app.config.globalProperties.$db = firebase;
})
