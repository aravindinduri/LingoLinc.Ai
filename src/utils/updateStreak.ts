import { firestore } from '@/app/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

const updateStreak = async (userId: string, language: string) => {
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const today = dayjs().startOf('day').format('YYYY-MM-DD');
    
    let newStreakCount = userData.streakCount || 0;
    const lastCompletedDate = userData.lastCompletedDate || null;
    const lessonsCompletedOn = userData.languages?.[language]?.lessonsCompletedOn || [];

    if (!lessonsCompletedOn.includes(today)) {
      lessonsCompletedOn.push(today);
      
      if (lastCompletedDate) {
        const lastDate = dayjs(lastCompletedDate);
        if (dayjs(today).diff(lastDate, 'day') === 1) {
          newStreakCount += 1;
        } else if (dayjs(today).diff(lastDate, 'day') > 1) {
          newStreakCount = 1;
        }
      } else {
        newStreakCount = 1;
      }

      await updateDoc(userRef, {
        streakCount: newStreakCount,
        lastCompletedDate: today,
        [`languages.${language}.lessonsCompletedOn`]: lessonsCompletedOn,
      });
    }
  }
};

export default updateStreak;
