// src/scenes/event/eventFields.js

export const eventViewFields = [
    { label: 'Event Name', name: 'eventName' },
    { label: 'Description', name: 'eventDescription' },
    { label: 'Image URL', name: 'eventImage' },
    { label: 'Date', name: 'eventDate', type: 'date' }, 
    { label: 'Time', name: 'eventTime' }, 
    { label: 'Location', name: 'eventLocation' },
    { label: 'User Rules', name: 'eventUserRules' },
    { label: 'Cost', name: 'eventCost', type: 'number' },
    { label: 'Cost Splitted', name: 'isEventCostSplitted', type: 'boolean'}, 
    { label: 'Withdrawal Requested', name: 'isWithdrawRequested', type: 'boolean' },
    { label: 'Total Paid by Members', name: 'totalPaidByMembers', type: 'number' }, 
    { label: 'Category', name: 'eventCategory' },
    { label: 'Hashtag', name: 'eventHashtag' },
    { label: 'Popular', name: 'isPopular', type: 'boolean' },
    { label: 'Upcoming', name: 'isUpcoming', type: 'boolean' }, 
    { label: 'Open', name: 'isOpen', type: 'boolean' }
  ];