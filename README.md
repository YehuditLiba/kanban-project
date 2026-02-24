# 📋 Kanban Task Board - Technical Overview

לוח משימות אינטראקטיבי המממש מתודולוגיית **Agile** וניהול זרימת עבודה חכם.

---

### 🚀 ארכיטקטורה ועקרונות פיתוח

* **Modular Service Architecture (Non-Component Logic)**
    ניהול התקשורת מול ה-Backend מבוצע בתוך **Service Module** נקי (Vanilla JS) ולא כקומפוננטת React.
    * **Performance**: המודול אינו משתתף במחזור ה-**Re-render** של ה-Virtual DOM, מה שמבטיח עבודה יעילה ומהירה.
    * **Decoupling**: הפרדה מוחלטת בין הלוגיקה העסקית לשכבת התצוגה (UI).

---

### 🛠️ מימושים טכניים מרכזיים

* **Native Drag & Drop Implementation**
    מימוש מלא באמצעות **HTML5 Drag & Drop API** ללא הסתמכות על ספריות חיצוניות.
    * **State Persistence**: סנכרון מיידי של מיקומי המשימות ב-DB באמצעות בקשות **PATCH** לשמירה על שלמות הנתונים.
    * **UX Feedback**: אינדיקציות ויזואליות בזמן גרירה (Drop zone highlighting) לשדרוג חוויית המשתמש.

* **WIP Limits & Business Logic**
    אכיפת מגבלות עומס עבודה למניעת צווארי בקבוק (Bottlenecks):
    * **Server-side Validation**: השרת חוסם חריגות מה-**WIP Limit** ומחזיר Error Response תואם.
    * **Client Feedback**: חיווי ויזואלי דינמי על קיבולת העמודות בלוח (Progress indicator).

* **Client-side Filtering**
    * **In-memory Filtering**: סינון לפי *Assignee* או *Priority* מתבצע ישירות על ה-State לביצועים אופטימליים ללא **Network Overhead**.

---

### 📈 Roadmap & Future Enhancements

* **Containerization**: הוספת תמיכה ב-**Docker** ליצירת סביבת פיתוח והפצה אחידה.
* **Production Database**: מעבר מ-SQLite למסד נתונים חזק יותר (כמו **PostgreSQL**) לתמיכה בעומסים גבוהים.
* **Unit Testing**: הוספת בדיקות לוגיקה לשכבת ה-Service ול-Backend.

---

### ⚙️ הוראות הרצה (Installation)

```bash
# Install dependencies
npm install && cd client && npm install

# Start the application
npm start
