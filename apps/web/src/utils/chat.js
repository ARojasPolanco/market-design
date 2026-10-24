export function otherParty(conversation, userId) {
  if (!conversation) return null;
  if (conversation.type === 'support') {
    return { name: 'Soporte Market Design', isSupport: true, id: null };
  }
  return conversation.buyerId === userId ? conversation.seller : conversation.buyer;
}

export function displayName(person) {
  if (!person) return 'Conversación';
  return person.storeName || person.username || person.name || person.fullname || 'Usuario';
}

export function initials(person) {
  const name = displayName(person);
  return name.charAt(0).toUpperCase();
}

export function formatChatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
}
