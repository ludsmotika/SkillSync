import { collection, doc, getDocs, getDoc, addDoc, deleteDoc, query, Timestamp, orderBy, updateDoc } from "firebase/firestore";
import {db} from "../firebase/base.js";

export const getTopic = async (topicId) => {
    const topicRef = doc(db, "forumComments", topicId);
    const topicSnap = await getDoc(topicRef);
    return {...topicSnap.data(), id: topicId};

}

export const getAllTopics = async () => {
    const q = query(collection(db, "forumComments"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data())
    }))
}

export const createTopic = async (data) => {
    const dataWithTime = {...data, createdAt: Timestamp.now()}

    const topicRef = await addDoc(collection(db, "forumComments"), dataWithTime);
    
    return { ...dataWithTime, id: topicRef.id };
}

export const updateTopic = async (topicId, data) => {
    const topicRef = doc(db, 'forumComments', topicId);
    
    await updateDoc(topicRef, data);

    return { ...data, id:topicId};
}

export const deleteTopic = async (topicId) => {
    await deleteDoc(doc(db, "forumComments", topicId));
}

export const commentTopic = async (topicId, newComment, comments) => {
    const topicRef = doc(db, "forumComments", topicId);

    newComment.comment.createdAt = Timestamp.now();

    const allComments = [...comments, newComment]
    const data = {comments: allComments};

    await updateDoc(topicRef, data);

    return allComments;
}