import Dexie from 'dexie';

/**
 * Run-A-Way 应用数据库
 * 使用 IndexedDB 存储所有记录，数据完全在本地，保护隐私
 */
class MentorLogDatabase extends Dexie {
  constructor() {
    super('MentorLogDB');

    // 定义数据库表结构
    // 语法: '字段名1, 字段名2, ...'
    // ++id 表示自增主键
    this.version(1).stores({
      records: '++id, date, tags, createdAt'
    });
  }
}

// 创建数据库实例
const db = new MentorLogDatabase();

export default db;
