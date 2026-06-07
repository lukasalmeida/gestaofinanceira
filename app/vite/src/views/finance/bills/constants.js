export const RECURRENCE_OPTIONS = [
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
  { value: 'ONCE', label: 'Única' }
];

export const RECURRENCE_LABELS = {
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
  ONCE: 'Única'
};

export const EMPTY_BILL_FORM = {
  description: '',
  amount: '',
  recurrence: 'MONTHLY',
  dueDay: ''
};
