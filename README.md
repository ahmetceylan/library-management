# Library Management System API

This repository contains a RESTful API for a Library Management System, built with Node.js, Express, and TypeORM. The application allows users to manage library members, books, and the borrowing process.

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Migration**: TypeORM Migrations

## Prerequisites

- Node.js
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmetceylan/library-management.git
   cd library-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other configuration.

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

### Using Docker Compose

Docker Compose is available for easier setup and management of your application and its dependencies. You can run the application using Docker Compose by following these steps:

1. Create a `.env` file based on the `.env.example` file and configure your database credentials.

2. Build and start the application with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. The application will be accessible at `http://localhost:3000`.

### Direct Docker Commands

If you prefer to use Docker directly without Docker Compose, you can follow these steps:

1. Build the Docker image:
   ```bash
   docker build -t library-management .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 --env-file .env library-management
   ```

This will start the application in a Docker container, making it easier to manage dependencies and environment configurations.


## API Documentation

The API is documented using Swagger. Once the application is running, you can access the documentation at: `http://localhost:3000/api-docs`

You can also use the postman collection in root folder

## Concurrency and Race Condition Handling

Optimistic locking and transaction support have not been implemented yet due to uncertainty about the necessity of these features. However, to avoid overengineering, it is advisable to implement them if needed. If transaction support is to be implemented, it would be appropriate to add it to the borrowing endpoints.

### Example Code for Borrowing with Transaction and Optimistic Locking

To implement optimistic locking, it is necessary to add a version field to the db entity.

```typescript
/**
 * Borrow a book with transaction and optimistic locking
 */
async borrowBook(userId: number, bookId: number): Promise<void> {
  return this.dataSource.transaction(async (transactionalEntityManager) => {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Find book
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    // Create new borrowing record
    const borrowing = new Borrowing();
    borrowing.userId = userId;
    borrowing.bookId = bookId;
    borrowing.borrowDate = new Date();

    await transactionalEntityManager.save(borrowing);
  });
}

/**
 * Return a book with transaction and optimistic locking
 */
async returnBook(userId: number, bookId: number, returnBookDto: ReturnBookDto): Promise<void> {
  return this.dataSource.transaction(async (transactionalEntityManager) => {
    
    const borrowing = await this.borrowingRepository.findActiveBorrowing(userId, bookId);
    if (!borrowing) {
    throw new NotFoundException(`No active borrowing found for user ${userId} and book ${bookId}`);
    }

    // Update borrowing record
    borrowing.returnDate = new Date();
    borrowing.score = returnBookDto.score;


    // Save both entities in transaction - version fields handle optimistic locking
    await transactionalEntityManager.save(book);
    await transactionalEntityManager.save(borrowing);
  });
}
```
