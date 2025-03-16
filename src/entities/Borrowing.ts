import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Check } from 'typeorm';
import { User } from './User';
import { Book } from './Book';

@Entity('borrowings')
@Check(`"score" >= 1 AND "score" <= 10`)
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.borrowings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, (book) => book.borrowings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @CreateDateColumn({ name: 'borrow_date' })
  borrowDate: Date;

  @Column({ name: 'return_date', nullable: true, type: 'timestamp' })
  returnDate: Date;

  @Column({ nullable: true, type: 'int' })
  score: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
