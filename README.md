Kanban Task Board - Technical Overview
🚀 ארכיטקטורה ומושגים מרכזיים
1. Separation of Concerns (SoC) & Service Layer
ניהול התקשורת מול ה-Backend מבוצע ב-Service Module נקי (Vanilla JS) ולא כקומפוננטת React.

Performance: המודול אינו גורם ל-Re-render מיותר של ה-Virtual DOM, מה שמבטיח עבודה יעילה ומהירה.

Decoupling: הפרדה מוחלטת בין הלוגיקה העסקית לשכבת התצוגה.

2. Native Drag & Drop Implementation
מימוש מלא באמצעות HTML5 Drag & Drop API ללא ספריות חיצוניות.

State Persistence: סנכרון מיידי של מיקומי המשימות ב-DB באמצעות בקשות PATCH.

UX Feedback: אינדיקציות ויזואליות בזמן גרירה לשדרוג חוויית המשתמש.

3. WIP Limits & Validations
אכיפת מתודולוגיית Agile באמצעות מגבלות עומס:

Server-side Validation: השרת חוסם חריגות מה-WIP Limit ומחזיר Error Response תואם.

Client Feedback: חיווי ויזואלי דינמי על קיבולת העמודות בלוח.

4. Client-side Filtering
In-memory Filtering: סינון לפי Assignee או Priority מתבצע ישירות על ה-State לביצועים אופטימליים ללא Network Overhead.

🛠️ Roadmap & Future Enhancements
Containerization: הוספת תמיכה ב-Docker ליצירת סביבת פיתוח והפצה אחידה.

Production Database: מעבר מ-SQLite למסד נתונים חזק יותר (כמו PostgreSQL) לתמיכה בעומסים גבוהים.

Unit Testing: הוספת בדיקות לוגיקה לשכבת ה-Service ול-Backend.

⚙️ Installation
Bash
npm install && cd client && npm install
npm start
