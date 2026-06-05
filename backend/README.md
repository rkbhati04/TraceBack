# TraceBack - Lost and Found API Backend

TraceBack is a Spring Boot-based backend API for a Lost and Found platform. It allows users to report lost or found items, manage items, claim items by providing proof of ownership, and helps administrators manage the claims workflow to return lost property to its rightful owners.

---

## Key Features

*   **User Management**: Supports multiple user roles (`ROLE_USER`, `ROLE_ADMIN`) with profiles for reporting and claiming items.
*   **Item Directory**: Report items with categories (Electronics, Keys, Wallet, Documents, etc.), locations, dates, and images, marked as `LOST` or `FOUND`.
*   **Ownership Claim Workflow**: Claim items by submitting proof of ownership. Claims are tracked through states (`PENDING`, `APPROVED`, `REJECTED`).
*   **Input Validation**: Validates API request payloads to ensure data integrity using Jakarta Validation.
*   **Robust Error Handling**: Centralized exception handling to return client-friendly JSON error details.

---

## Technology Stack

*   **Language**: Java 17
*   **Framework**: Spring Boot 3.3.5
*   **Database**: MySQL
*   **ORM**: Spring Data JPA / Hibernate
*   **Utilities**: Lombok (for reducing boilerplate), Jakarta Validation
*   **Build Tool**: Maven

---

## Project Structure

```text
c:/TraceBack/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/traceback/backend/
│   │   │   │   ├── controller/          # REST Controllers (API Endpoints)
│   │   │   │   ├── exception/           # Custom Exceptions & Global Exception Handler
│   │   │   │   ├── model/               # JPA Entities & Enums
│   │   │   │   ├── repository/          # Spring Data JPA Repository Interfaces
│   │   │   │   ├── service/             # Business Logic Layer
│   │   │   │   └── BackendApplication.java # Main Application Entry Point
│   │   │   └── resources/
│   │   │       ├── application.properties # Database & Hibernate Config
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/                        # Unit and Integration Tests
│   ├── pom.xml                          # Maven Configuration & Dependencies
│   └── mvnw / mvnw.cmd                  # Maven Wrapper Scripts
└── .gitignore                           # Project Git Ignore Configurations
```

---

## Database Configuration

The application is configured to connect to a **MySQL** database.

1.  **Create Database Schema**:
    Ensure MySQL is running, then create a database named `TraceBack`:
    ```sql
    CREATE DATABASE TraceBack;
    ```

2.  **Configure Credentials**:
    Open [backend/src/main/resources/application.properties](file:///c:/TraceBack/backend/src/main/resources/application.properties) and update the datasource properties to match your local setup:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/TraceBack
    spring.datasource.username=YOUR_MYSQL_USERNAME
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    ```

3.  **Schema Auto-Update**:
    The Hibernate DDL setting is configured to `update`, which will automatically generate and alter database tables as entities change:
    ```properties
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    ```

---

## API Endpoints (Items)

All endpoints default to base path `/items`. Below are the available operations:

| Method | Endpoint | Description | Payload Constraints |
| :--- | :--- | :--- | :--- |
| **POST** | `/items` | Add a new lost/found item | Required fields: `title`, `description`, `type`, `category`, `location`, `dateOccurred`, `reporter` |
| **GET** | `/items` | Get list of all items | None |
| **GET** | `/items/{id}` | Get item details by ID | Path variable `id` (Long) |
| **PUT** | `/items/{id}` | Update existing item details | Full item entity payload |
| **DELETE** | `/items/{id}` | Delete item by ID | Path variable `id` (Long) |

### Sample Payload (Add Item)
```json
{
  "title": "iPhone 15 Pro",
  "description": "Black Titanium iPhone 15 Pro found near the cafeteria.",
  "type": "FOUND",
  "category": "ELECTRONICS",
  "location": "Central Cafeteria",
  "dateOccurred": "2026-06-05",
  "reporter": {
    "id": 1
  }
}
```

---

## Running the Application

To run the application locally:

### Using the Maven Wrapper (Recommended)
Navigate to the `backend` directory and execute:

*   **Windows**:
    ```powershell
    cd backend
    .\mvnw.cmd spring-boot:run
    ```
*   **macOS / Linux**:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```

The application will start on port `8080` by default. You can test it by hitting `http://localhost:8080/items`.

---

## Running Tests

To run the unit tests:
```bash
cd backend
./mvnw test   # (or .\mvnw.cmd test on Windows)
```

---

## Next Implementation Steps

To complete the backend according to the development roadmap:
1.  **Security Integration**: Integrate Spring Security and implement JWT (JSON Web Token) authentication.
2.  **Auth Endpoints**: Add Registration and Login endpoints inside a new `AuthController`.
3.  **Claims API**: Implement `ClaimService` and `ClaimController` to handle ownership submissions and approvals.
4.  **Admin Portal Services**: Build administrative APIs to resolve reports and manage users.
