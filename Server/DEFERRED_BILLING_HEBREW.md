# מדריך הטמעה - מערכת חיוב מעוגל
<div dir="rtl" style="direction: rtl; text-align: right;">

# מדריך הטמעה - מערכת חיוב מעוגל
## סיכום המערכת החדשה

יצרתי לך מערכת חיוב חכמה שמאפשרת:

1. **שמירה על הפונקציה הקיימת** - התשלום הישיר שלך עדיין פועל בדיוק כמו היה
2. **חיוב מעוגל חדש** - לא דורס את הקיים, אלא מהווה אפשרות נוספת לבחירה
3. **ניהול עיתונים חדשים** - אם יצאה גרסה חדשה עד שלא סיימת לחייב את הקודמת - המערכת מטפלת בשניהם במקביל


## מבנה המערכת

### קבצים חדשים שנוצרו:

```
src/models/
  ├── Edition.js              # עיתון (גרסה, תאריך, PDF)
  └── BillingSchedule.js      # תור חיובים מתוזמנים

src/services/
  ├── DeferredBilling.js      # לוגיקה החיוב המעוגל
  └── BillingCronJob.js       # קרון ג'וב להרצה אוטומטית

src/models/
  └── Payment.js              # עדכן - הוסיף שדות חדשים

src/controllers/
  └── PaymentController.js    # עדכן - הוסיף endpoints חדשים

src/routes/
  └── PaymentRoute.js         # עדכן - הוסיף routes חדשות
```


## כיצד להשתמש

### דוגמה: 400 משתמשים, חיוב על פני 4 חודשים

#### שלב 1: יצרת עיתון חדש
כשאתה יוצר עיתון חדש, אתה קורא ל-endpoint הזה:

```
POST /api/payment/deferred/schedule
```

**גוף הבקשה:**
```json
{
  "editionDate": "2026-02-20",
  "pdfUrl": "https://my-server.com/papers/2026-02-20.pdf",
  "subscriberIds": ["user1", "user2", "user3", ..., "user400"],
  "subscriptionId": "subscription123",
  "amount": 10,
  "billingMonths": 4,
  "chargesPerMonth": 100
}
```

**מה קורה:**
  - 100 מתוזמנות ל-1 במרץ
  - 100 מתוזמנות ל-1 באפריל
  - 100 מתוזמנות ל-1 במאי
  - 100 מתוזמנות ל-1 ביוני

#### שלב 2: הפעל קרון ג'וב
התוסף בקובץ `app.js`:

```javascript
import { startBillingCronJob } from './services/BillingCronJob.js';

// בתוך ה-startup שלך:
startBillingCronJob(); // מרוץ כל יום ב-2 בבוקר
```

**מה קורה:**

#### שלב 3: עקוב אחרי התקדמות
```
GET /api/payment/deferred/edition/{editionId}/status
```

**תגובה:**
```json
{
  "totalSubscribers": 400,
  "totalCharged": 100,
  "statusBreakdown": {
    "pending": 300,
    "charged": 100,
    "failed": 0,
    "skipped": 0
  },
  "completionPercentage": 25
}
```


## מה קורה בחודשים ההבאים?

### חודש 1 (מרץ):

### חודש 2 (אפריל):

**איך המערכת מטפלת בזה:**


## בחירה: חיוב מיידי vs מעוגל

### באפליקציה שלך - אתה בוחר לכל עיתון:

**אפשרות 1: חיוב מיידי (קיים)**
```javascript
// התשלום הישיר שלך - ללא שינוי
POST /api/payment/start
```

**אפשרות 2: חיוב מעוגל (חדש)**
```javascript
POST /api/payment/deferred/schedule
```


## API Endpoints קיים ונוסף

### קיים (לא שינוי):
```
POST /api/payment/start              # חיוב מיידי
POST /api/payment/cardcomCallback    # callback מקראדקום
```

### חדש (מעוגל):
```
POST /api/payment/deferred/schedule              # יצור תור חיובים
POST /api/payment/deferred/process               # עבד חיובים (ידי או קרון)
GET  /api/payment/deferred/edition/:id/status   # בדוק סטטוס
POST /api/payment/deferred/cancel                # בטל חיובים משתמש
```


## תכונות חכמות

### 1️⃣ עיתונים חופפים
אם יצא עיתון חדש בזמן שעדיין מעבדים את הקודם - שניהם נחברים בתור:

```
עיתון A (20/2) - ימשיך לחייב דרך יוני
עיתון B (1/3) - יתחיל לחייב מאפריל
```

### 2️⃣ ניסיון חוזר אוטומטי
אם חיוב נכשל - המערכת מחדשת את הניסיון בהרצה הבאה (עד 3 פעמים)

### 3️⃣ משתמשים בלי כרטיס שמור
אם למשתמש אין כרטיס שמור בקראדקום - מסומן כ-"skipped" לא "failed"

### 4️⃣ ביטול חיובים
מנהל יכול לבטל חיובים עתידיים לא רק עבור עיתון מסוים


## הגדרות

### שנה את הגבלות קראדקום
בשורה שיוצרת `Edition`:

```javascript
billingMonths: 4,        // משך המיפול
chargesPerMonth: 100     // הגבלת קראדקום
```

### שנה זמן קרון ג'וב
בקובץ `BillingCronJob.js`:

```javascript
cron.schedule("0 2 * * *", ...) // כל יום ב-2 בבוקר
```

חריטות שימושיות:


## בדיקה

### 1. בדוק שהקבצים החדשים נטענים
בבקרה עם:
```javascript
import Edition from './models/Edition.js';
import BillingSchedule from './models/BillingSchedule.js';
console.log('Models loaded'); // אם הדפס - הכל טוב
```

### 2. בדוק endpoint בישיר
```bash
curl -X POST http://localhost:5000/api/payment/deferred/schedule \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 3. פעל ב-MongoDB ישיר
```javascript
// בדוק שטבלאות חדשות נוצרו
const editions = await Edition.find();
const schedules = await BillingSchedule.find();
console.log('Editions:', editions.length);
console.log('Schedules:', schedules.length);
```


## שלבים הבאים

1. ✅ התקן את הקבצים (כבר עשינו)
2. ⏳ בדוק שהכל קומפיל בלא שגיאות
3. ⏳ הפעל בסביבת בדיקה עם משתמשים מזויפים
4. ⏳ הגדר קרון ג'וב בפרודקשן
5. ⏳ ארגן דשבורד למנהל לעקוב אחרי חיובים


## שאלות?

אם משהו לא ברור או צריך תיקון - אמור לי! 🚀
</div>
