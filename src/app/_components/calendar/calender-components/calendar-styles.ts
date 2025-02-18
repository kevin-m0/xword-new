export const calendarStyles = {
    base: [
        'rounded-md',
        // Base calendar styling
        '[&_.rbc-month-view]:border [&_.rbc-month-view]:border-xw-secondary [&_.rbc-month-view]:rounded-md',
        '[&_.rbc-off-range-bg]:bg-xw-sidebar [&_.rbc-off-range-bg]:text-xw-muted-foreground',

        // Header styling
        '[&_.rbc-header]:border-b [&_.rbc-header]:border-xw-secondary [&_.rbc-header]:p-2',
        '[&_.rbc-header]:font-medium',
        '[&_.rbc-header+.rbc-header]:border-l [&_.rbc-header+.rbc-header]:border-xw-secondary',

        // Day cells styling
        '[&_.rbc-month-row]:border-b-0 [&_.rbc-month-row]:border-xw-secondary',
        '[&_.rbc-day-bg+.rbc-day-bg]:border-l [&_.rbc-day-bg+.rbc-day-bg]:border-xw-secondary',
        '[&_.rbc-day-bg]:text-sm',
        '[&_.rbc-day-bg]:hover:bg-xw-background/50',
        '[&_.rbc-month-row+.rbc-month-row]:border-t [&_.rbc-month-row+.rbc-month-row]:border-xw-secondary',

        // Today cell styling
        '[&_.rbc-today]:bg-purple-500/40',

        // Event styling
        '[&_.rbc-event]:rounded-md',
        '[&_.rbc-event]:bg-transparent',
        '[&_.rbc-event]:border-none',
        '[&_.rbc-event-content]:h-full',
        '[&_.rbc-event]:border [&_.rbc-event]:border-xw-secondary',

        // Date cell styling
        '[&_.rbc-date-cell]:text-left',
        '[&_.rbc-date-cell]:px-2 [&_.rbc-date-cell]:py-1',
        '[&_.rbc-date-cell]:text-sm',

        // Show more styling
        '[&_.rbc-show-more]:text-xw-primary [&_.rbc-show-more]:text-sm [&_.rbc-show-more]:font-normal',
        '[&_.rbc-show-more]:hover:underline [&_.rbc-show-more]:hover:text-xw-primary',
        '[&_.rbc-show-more]:bg-transparent',
        '[&_.rbc-show-more]:m-1',

        // Row styling
        '[&_.rbc-row-content]:z-0',
        '[&_.rbc-row-content_button]:z-10',

        // Additional border fixes
        '[&_.rbc-month-row:last-child]:border-b-0 [&_.rbc-month-row:last-child]:border-xw-secondary',
        '[&_.rbc-day-bg:first-child]:border-l-0 [&_.rbc-day-bg:first-child]:border-xw-secondary',
    ].join(' '),
} 