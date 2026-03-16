# 🚀 SpendSense Deployment Guide

Follow these steps to host your SpendSense backend online for free.

## Phase 1: Managed MySQL Setup (Aiven)

We need a persistent MySQL database. Aiven offers a great free tier.

1.  **Sign Up**: Go to [Aiven.io](https://aiven.io/) and create a free account.
2.  **Create Service**: Click "Create a new service".
3.  **Select MySQL**: Choose **MySQL** as the service type.
4.  **Cloud & Region**: Select "Google Cloud" or "AWS" (choose the region closest to you).
5.  **Service Plan**: Select the **Free** plan.
6.  **Name It**: Name your service (e.g., `spendsense-db`).
7.  **Get Credentials**: Once the service is "Running", note down:
    *   **Host**
    *   **Port**
    *   **User** (usually `avnadmin`)
    *   **Password**
    *   **Database Header** (e.g., `defaultdb`)

---

## Phase 2: Prepare Backend for Render

Render will pull your code from GitHub and run it.

1.  **GitHub Repo**: Ensure your project is pushed to a **private** GitHub repository (to keep your `pom.xml` and folder structure organized).
2.  **Sign Up for Render**: Go to [Render.com](https://render.com/) and connect your GitHub account.
3.  **New Web Service**: Click **New +** → **Web Service**.
4.  **Connect Repo**: Select your `SpendSense` repository.
5.  **Runtime Configuration**:
    *   **Runtime**: `Docker` (recommended for Java) or `Native` (using Maven). I will provide a `Dockerfile` to make this seamless.
    *   **Region**: Same as your database.
    *   **Instance Type**: **Free**.

### 🛠️ Environment Variables in Render
In the Render dashboard, go to the **Environment** tab and add:
*   `DB_URL`: `jdbc:mysql://<your-host>:<your-port>/defaultdb?useSSL=true`
*   `DB_USERNAME`: `avnadmin`
*   `DB_PASSWORD`: `<your-password>`
*   `JWT_SECRET`: `A_Very_Long_Random_String_At_Least_32_Chars` (IMPORTANT: Must be 32+ characters long for security)

---

## Phase 3: Mobile App Update

Once your backend is live (e.g., `https://spendsense-api.onrender.com`), update your mobile app:

1.  Open `mobile/src/api/apiClient.js`.
2.  Change the `baseURL` to your new Render URL.

---

## Next Steps
1. I will create the `application-prod.properties` file for you now.
2. I will also create a `Dockerfile` in the root directory to make deployment to Render super easy.
3. Once those are ready, you can push the changes to GitHub and follow the steps above!
