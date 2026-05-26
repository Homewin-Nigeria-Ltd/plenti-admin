export type RiderChatMessage = {
  id: string;
  text: string;
  time: string;
  outgoing: boolean;
  read?: boolean;
};

export type RiderConversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  avatarUrl?: string | null;
  initials?: string;
  avatarColor?: string;
  unread?: number;
  pinned?: boolean;
  read?: boolean;
  lastSeen?: string;
  isGroup?: boolean;
  online?: boolean;
};

export const RIDER_CHAT_CONVERSATIONS: RiderConversation[] = [
  {
    id: "cody",
    name: "Cody Fisher",
    preview: "I am stuck in traffic on Third Mainland Bridge...",
    time: "10:12 AM",
    avatarUrl:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    pinned: true,
    read: true,
    lastSeen: "last seen recently",
    online: true,
  },
  {
    id: "designers",
    name: "Designers",
    preview: "Yes, it's available",
    time: "Wed",
    initials: "D",
    avatarColor: "#7C3AED",
    unread: 2,
    isGroup: true,
    online: true,
  },
  {
    id: "ahmed",
    name: "Ahmed Lawal",
    preview: "Order delivered successfully",
    time: "9:45 AM",
    avatarUrl:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    read: true,
    online: true,
  },
  {
    id: "amina",
    name: "Amina Bello",
    preview: "On my way to pickup point",
    time: "Yesterday",
    avatarUrl:
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    unread: 1,
    online: false,
  },
  {
    id: "james",
    name: "James Okafor",
    preview: "Can you confirm the address?",
    time: "Mon",
    avatarUrl:
      "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    read: true,
  },
  {
    id: "fatima",
    name: "Fatima Ahmed",
    preview: "Thanks for the update",
    time: "Sun",
    avatarUrl:
      "https://images.pexels.com/photos/3756616/pexels-photo-3756616.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
  },
  {
    id: "blessing",
    name: "Blessing Adeyemi",
    preview: "Pickup completed at warehouse B",
    time: "Sat",
    initials: "BA",
    avatarColor: "#0F973D",
    read: true,
  },
  {
    id: "chinedu",
    name: "Chinedu Nwosu",
    preview: "Customer not responding to calls",
    time: "Fri",
    avatarUrl:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    unread: 3,
  },
  {
    id: "chioma",
    name: "Chioma Nwosu",
    preview: "Need directions to drop-off",
    time: "Thu",
    avatarUrl:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
  },
  {
    id: "damilola",
    name: "Damilola Ogundipe",
    preview: "Running late by 10 minutes",
    time: "Wed",
    initials: "DO",
    avatarColor: "#F59E0B",
    read: true,
  },
  {
    id: "emeka",
    name: "Emeka Obi",
    preview: "Order handed to customer",
    time: "Wed",
    avatarUrl:
      "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
  },
  {
    id: "grace",
    name: "Grace Eze",
    preview: "Please confirm new route",
    time: "Tue",
    avatarUrl:
      "https://images.pexels.com/photos/2728261/pexels-photo-2728261.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    unread: 1,
  },
  {
    id: "halima",
    name: "Halima Yusuf",
    preview: "At the restaurant now",
    time: "Tue",
    avatarUrl:
      "https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    read: true,
  },
  {
    id: "ibrahim",
    name: "Ibrahim Musa",
    preview: "Traffic on Lekki expressway",
    time: "Mon",
    avatarUrl:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
  },
  {
    id: "musa",
    name: "Musa Tanko",
    preview: "Ready for next assignment",
    time: "Mon",
    avatarUrl:
      "https://images.pexels.com/photos/3823495/pexels-photo-3823495.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    read: true,
  },
  {
    id: "ngozi",
    name: "Ngozi Ibe",
    preview: "Battery low on device",
    time: "Sun",
    initials: "NI",
    avatarColor: "#EC4899",
  },
  {
    id: "nkechi",
    name: "Nkechi Okoro",
    preview: "Shift ending in 30 mins",
    time: "Sun",
    avatarUrl:
      "https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
  },
  {
    id: "segu",
    name: "Segun Adebayo",
    preview: "Thanks admin",
    time: "Sat",
    avatarUrl:
      "https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    read: true,
  },
  {
    id: "tunde",
    name: "Tunde Williams",
    preview: "New rider onboarding docs sent",
    time: "Sat",
    avatarUrl:
      "https://images.pexels.com/photos/3771107/pexels-photo-3771107.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
  },
  {
    id: "uche",
    name: "Uche Okafor",
    preview: "Waiting at pickup point",
    time: "Fri",
    avatarUrl:
      "https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    unread: 2,
  },
  {
    id: "yewande",
    name: "Yewande Olawale",
    preview: "Delivered ORD-2912",
    time: "Fri",
    avatarUrl:
      "https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=400&q=80",
    read: true,
  },
];

export const RIDER_CHAT_MESSAGES: Record<string, RiderChatMessage[]> = {
  cody: [
    {
      id: "1",
      text: "I am stuck in traffic on Third Mainland Bridge. ETA extended by 20 mins.",
      time: "9:52 PM",
      outgoing: false,
    },
    {
      id: "2",
      text: "Understood Musa. Please update the customer. Drive safe.",
      time: "9:54 PM",
      outgoing: true,
      read: true,
    },
  ],
  designers: [
    {
      id: "1",
      text: "Is the new banner asset ready?",
      time: "2:30 PM",
      outgoing: false,
    },
    {
      id: "2",
      text: "Yes, it's available",
      time: "2:45 PM",
      outgoing: true,
      read: true,
    },
  ],
  ahmed: [
    {
      id: "1",
      text: "Order #ORD-2840 has been delivered.",
      time: "9:40 AM",
      outgoing: false,
    },
    {
      id: "2",
      text: "Great work, thanks Ahmed.",
      time: "9:45 AM",
      outgoing: true,
      read: true,
    },
  ],
  amina: [
    {
      id: "1",
      text: "On my way to pickup point",
      time: "Yesterday",
      outgoing: false,
    },
  ],
  james: [
    {
      id: "1",
      text: "Can you confirm the address?",
      time: "Mon",
      outgoing: false,
    },
  ],
  fatima: [
    {
      id: "1",
      text: "Thanks for the update",
      time: "Sun",
      outgoing: false,
    },
  ],
  blessing: [{ id: "1", text: "Pickup completed at warehouse B", time: "Sat", outgoing: false }],
  chinedu: [{ id: "1", text: "Customer not responding to calls", time: "Fri", outgoing: false }],
  chioma: [{ id: "1", text: "Need directions to drop-off", time: "Thu", outgoing: false }],
  damilola: [{ id: "1", text: "Running late by 10 minutes", time: "Wed", outgoing: false }],
  emeka: [{ id: "1", text: "Order handed to customer", time: "Wed", outgoing: false }],
  grace: [{ id: "1", text: "Please confirm new route", time: "Tue", outgoing: false }],
  halima: [{ id: "1", text: "At the restaurant now", time: "Tue", outgoing: false }],
  ibrahim: [{ id: "1", text: "Traffic on Lekki expressway", time: "Mon", outgoing: false }],
  musa: [{ id: "1", text: "Ready for next assignment", time: "Mon", outgoing: false }],
  ngozi: [{ id: "1", text: "Battery low on device", time: "Sun", outgoing: false }],
  nkechi: [{ id: "1", text: "Shift ending in 30 mins", time: "Sun", outgoing: false }],
  segu: [{ id: "1", text: "Thanks admin", time: "Sat", outgoing: false }],
  tunde: [{ id: "1", text: "New rider onboarding docs sent", time: "Sat", outgoing: false }],
  uche: [{ id: "1", text: "Waiting at pickup point", time: "Fri", outgoing: false }],
  yewande: [{ id: "1", text: "Delivered ORD-2912", time: "Fri", outgoing: false }],
};
