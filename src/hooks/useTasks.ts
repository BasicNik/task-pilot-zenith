import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { Task } from '../components/types';

// Extended Task interface for Firestore
export interface FirestoreTask extends Omit<Task, 'id' | 'dueDate' | 'completedAt'> {
  id: string; // Firestore document ID
  dueDate: string; // ISO string
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  completedAt?: any; // Firestore timestamp or undefined
}

// Convert Firestore task to app task
const convertFirestoreTask = (doc: any): Task => {
  const data = doc.data();
  return {
    id: doc.id, // Use Firestore document ID as string
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    tags: data.tags || [],
    status: data.status,
    starred: data.starred || false,
    completedAt: data.completedAt ? (typeof data.completedAt.toDate === 'function' ? data.completedAt.toDate().toISOString() : data.completedAt) : undefined,
  };
};

// Convert app task to Firestore task
const convertToFirestoreTask = (task: Omit<Task, 'id'>, userId: string): Omit<FirestoreTask, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    tags: task.tags,
    status: task.status,
    starred: task.starred || false,
    userId,
    ...(task.completedAt ? { completedAt: task.completedAt } : {}),
  };
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Real-time listener for tasks
  useEffect(() => {
    if (!user || !db) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    console.log(`📡 Setting up real-time listener for user: ${user.uid}`);

    try {
      // Create query for user's tasks, ordered by creation date
      const tasksQuery = query(
        collection(db, 'tasks', user.uid, 'taskList'),
        orderBy('createdAt', 'desc')
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        tasksQuery,
        (snapshot) => {
          console.log(`📊 Received ${snapshot.docs.length} tasks from Firestore`);
          
          const tasksData: Task[] = snapshot.docs.map((doc) => {
            const firestoreTask = { id: doc.id, ...doc.data() } as FirestoreTask;
            return convertFirestoreTask(doc);
          });

          setTasks(tasksData);
          setLoading(false);
        },
        (error) => {
          console.error('❌ Firestore listener error:', error);
          setError('Failed to load tasks. Please try again.');
          setLoading(false);
        }
      );

      return () => {
        console.log('🔌 Cleaning up Firestore listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ Error setting up Firestore listener:', error);
      setError('Failed to connect to database.');
      setLoading(false);
    }
  }, [user]);

  // Add new task
  const addTask = async (taskData: Omit<Task, 'id'>): Promise<Task | null> => {
    if (!user || !db) {
      console.warn('⚠️ No user or database available for adding task');
      return null;
    }

    try {
      console.log('📝 Adding new task to Firestore:', taskData);
      
      const firestoreTask = convertToFirestoreTask(taskData, user.uid);
      
      const docRef = await addDoc(
        collection(db, 'tasks', user.uid, 'taskList'),
        {
          ...firestoreTask,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      console.log('✅ Task added successfully with ID:', docRef.id);
      
      // Return the task with the new ID
      return {
        ...taskData,
        id: docRef.id,
      };
    } catch (error) {
      console.error('❌ Error adding task:', error);
      setError('Failed to add task. Please try again.');
      return null;
    }
  };

  // Update existing task
  const updateTask = async (taskId: string, taskData: Partial<Omit<Task, 'id'>>): Promise<boolean> => {
    if (!user || !db) {
      console.warn('⚠️ No user or database available for updating task');
      return false;
    }

    try {
      console.log(`📝 Updating task ${taskId}:`, taskData);
      const taskRef = doc(db, 'tasks', user.uid, 'taskList', taskId);
      // Fetch current task to check previous status
      const currentDoc = await getDoc(taskRef);
      const currentData = currentDoc.exists() ? currentDoc.data() : {};
      let updateFields: any = { ...taskData, updatedAt: serverTimestamp() };
      
      // Handle completedAt timestamp properly
      if ('completedAt' in updateFields && typeof updateFields.completedAt === 'string') {
        delete updateFields.completedAt;
      }
      
      if (taskData.status === 'Completed' && currentData.status !== 'Completed') {
        updateFields.completedAt = serverTimestamp();
      }
      
      await updateDoc(taskRef, updateFields);
      console.log('✅ Task updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating task:', error);
      setError('Failed to update task. Please try again.');
      return false;
    }
  };

  // Delete task
  const deleteTask = async (taskId: string): Promise<boolean> => {
    if (!user || !db) {
      console.warn('⚠️ No user or database available for deleting task');
      return false;
    }

    try {
      console.log(`🗑️ Deleting task ${taskId}`);
      
      const taskRef = doc(db, 'tasks', user.uid, 'taskList', taskId);
      await deleteDoc(taskRef);

      console.log('✅ Task deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
      return false;
    }
  };

  // Bulk operations
  const bulkDeleteTasks = async (taskIds: string[]): Promise<boolean> => {
    if (!user || !db) {
      console.warn('⚠️ No user or database available for bulk delete');
      return false;
    }

    try {
      console.log(`🗑️ Bulk deleting ${taskIds.length} tasks`);
      
      const deletePromises = taskIds.map(taskId => 
        deleteDoc(doc(db, 'tasks', user.uid, 'taskList', taskId))
      );
      
      await Promise.all(deletePromises);
      
      console.log('✅ Bulk delete completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error in bulk delete:', error);
      setError('Failed to delete tasks. Please try again.');
      return false;
    }
  };

  const bulkUpdateTasks = async (taskIds: string[], updates: Partial<Omit<Task, 'id'>>): Promise<boolean> => {
    if (!user || !db) {
      console.warn('⚠️ No user or database available for bulk update');
      return false;
    }

    try {
      console.log(`📝 Bulk updating ${taskIds.length} tasks:`, updates);
      const updatePromises = taskIds.map(async (taskId) => {
        const taskRef = doc(db, 'tasks', user.uid, 'taskList', taskId);
        const currentDoc = await getDoc(taskRef);
        const currentData = currentDoc.exists() ? currentDoc.data() : {};
        let updateFields: any = { ...updates, updatedAt: serverTimestamp() };
        
        // Handle completedAt timestamp properly
        if ('completedAt' in updateFields && typeof updateFields.completedAt === 'string') {
          delete updateFields.completedAt;
        }
        
        if (updates.status === 'Completed' && currentData.status !== 'Completed') {
          updateFields.completedAt = serverTimestamp();
        }
        
        return updateDoc(taskRef, updateFields);
      });
      
      await Promise.all(updatePromises);
      console.log('✅ Bulk update completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error in bulk update:', error);
      setError('Failed to update tasks. Please try again.');
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    bulkDeleteTasks,
    bulkUpdateTasks,
  };
};
