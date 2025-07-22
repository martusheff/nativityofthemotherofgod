// ~/composables/useFirestore.ts

import { db } from '~/utils/firebase'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  type WhereFilterOp
} from 'firebase/firestore'

export const useFirestore = () => {
  const getDocByPath = async (path: string) => {
    const ref = doc(db, path)
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  }

  const setDocByPath = async (path: string, data: object) => {
    const ref = doc(db, path)
    return await setDoc(ref, data, { merge: true })
  }

  const updateDocByPath = async (path: string, data: object) => {
    const ref = doc(db, path)
    return await updateDoc(ref, data)
  }

  const deleteDocByPath = async (path: string) => {
    const ref = doc(db, path)
    return await deleteDoc(ref)
  }

  const addDocToCollection = async (collectionPath: string, data: object) => {
    const colRef = collection(db, collectionPath)
    return await addDoc(colRef, { ...data, createdAt: serverTimestamp() })
  }

  const queryCollection = async (
    collectionPath: string,
    conditions: [string, WhereFilterOp, any][]
  ) => {
    const colRef = collection(db, collectionPath)
    const q = query(colRef, ...conditions.map(([field, op, val]) => where(field, op, val)))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  return {
    getDocByPath,
    setDocByPath,
    updateDocByPath,
    deleteDocByPath,
    addDocToCollection,
    queryCollection
  }
}
