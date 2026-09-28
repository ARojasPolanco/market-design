export async function up({ context: queryInterface }) {
  // Revert: keep category as ENUM, admin assigns from predefined list
  // This migration is intentionally a no-op since we want to keep the ENUM
}

export async function down({ context: queryInterface }) {
  // No-op
}