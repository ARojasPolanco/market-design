export async function up({ context: queryInterface }) {
  // This migration is a no-op since we manually fixed the category column
  // The category column is already an ENUM type
}

export async function down({ context: queryInterface }) {
  // No-op
}