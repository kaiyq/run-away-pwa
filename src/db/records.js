import db from './db';

/**
 * 记录操作类
 * 封装所有数据库操作
 */
class RecordService {
  /**
   * 添加新记录
   * @param {Object} recordData - 记录数据
   * @param {string} recordData.content - 导师言论
   * @param {string} recordData.myFeeling - 个人感受
   * @param {string} recordData.date - 日期 YYYY-MM-DD
   * @param {string[]} recordData.autoTags - AI自动生成的标签
   * @param {string[]} recordData.manualTags - 手动添加的标签
   * @returns {Promise<number>} 返回新记录的ID
   */
  async add(recordData) {
    try {
      const now = Date.now();
      const allTags = [
        ...(recordData.autoTags || []),
        ...(recordData.manualTags || [])
      ];

      const id = await db.records.add({
        content: recordData.content,
        myFeeling: recordData.myFeeling,
        date: recordData.date,
        autoTags: recordData.autoTags || [],
        manualTags: recordData.manualTags || [],
        tags: allTags, // 所有标签的合并，方便查询
        createdAt: now,
        updatedAt: now
      });
      return id;
    } catch (error) {
      console.error('添加记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有记录
   * @param {Object} options - 查询选项
   * @param {string} options.startDate - 开始日期
   * @param {string} options.endDate - 结束日期
   * @param {string[]} options.tags - 标签筛选
   * @param {string} options.searchText - 搜索关键词
   * @returns {Promise<Array>} 记录列表
   */
  async getAll(options = {}) {
    try {
      let collection = db.records.orderBy('createdAt').reverse();

      // 日期范围筛选
      if (options.startDate || options.endDate) {
        collection = db.records.toCollection();
        if (options.startDate) {
          collection = collection.filter(record => record.date >= options.startDate);
        }
        if (options.endDate) {
          collection = collection.filter(record => record.date <= options.endDate);
        }
      }

      const records = await collection.toArray();

      // 标签筛选
      let filtered = records;
      if (options.tags && options.tags.length > 0) {
        filtered = filtered.filter(record =>
          options.tags.some(tag => record.tags.includes(tag))
        );
      }

      // 关键词搜索
      if (options.searchText) {
        const keyword = options.searchText.toLowerCase();
        filtered = filtered.filter(record =>
          record.content.toLowerCase().includes(keyword) ||
          record.myFeeling.toLowerCase().includes(keyword)
        );
      }

      return filtered;
    } catch (error) {
      console.error('获取记录失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取单条记录
   * @param {number} id - 记录ID
   * @returns {Promise<Object>} 记录详情
   */
  async getById(id) {
    try {
      return await db.records.get(id);
    } catch (error) {
      console.error('获取记录详情失败:', error);
      throw error;
    }
  }

  /**
   * 更新记录
   * @param {number} id - 记录ID
   * @param {Object} updates - 要更新的字段
   * @returns {Promise<number>} 更新的记录数
   */
  async update(id, updates) {
    try {
      // 如果更新了标签，需要合并自动和手动标签
      if (updates.autoTags || updates.manualTags) {
        const record = await db.records.get(id);
        const autoTags = updates.autoTags !== undefined ? updates.autoTags : record.autoTags;
        const manualTags = updates.manualTags !== undefined ? updates.manualTags : record.manualTags;
        updates.tags = [...autoTags, ...manualTags];
      }

      updates.updatedAt = Date.now();
      return await db.records.update(id, updates);
    } catch (error) {
      console.error('更新记录失败:', error);
      throw error;
    }
  }

  /**
   * 删除记录
   * @param {number} id - 记录ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await db.records.delete(id);
    } catch (error) {
      console.error('删除记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有使用过的标签
   * @returns {Promise<Array>} 标签列表
   */
  async getAllTags() {
    try {
      const records = await db.records.toArray();
      const tagSet = new Set();
      records.forEach(record => {
        record.tags.forEach(tag => tagSet.add(tag));
      });
      return Array.from(tagSet);
    } catch (error) {
      console.error('获取标签失败:', error);
      throw error;
    }
  }

  /**
   * 获取统计数据
   * @returns {Promise<Object>} 统计数据
   */
  async getStatistics() {
    try {
      const records = await db.records.toArray();

      // 按日期统计记录数
      const dateCount = {};
      records.forEach(record => {
        dateCount[record.date] = (dateCount[record.date] || 0) + 1;
      });

      // 按标签统计
      const tagCount = {};
      records.forEach(record => {
        record.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      return {
        total: records.length,
        dateCount,
        tagCount
      };
    } catch (error) {
      console.error('获取统计数据失败:', error);
      throw error;
    }
  }

  /**
   * 导出所有数据
   * @returns {Promise<string>} JSON格式的数据
   */
  async exportData() {
    try {
      const records = await db.records.toArray();
      return JSON.stringify(records, null, 2);
    } catch (error) {
      console.error('导出数据失败:', error);
      throw error;
    }
  }
}

// 导出单例
const recordService = new RecordService();
export default recordService;
