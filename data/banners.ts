export type BannerStatus = "Active Ad" | "Inactive Ad";
export type BannerType = "In-page" | "Full-Page";
export type ScreenLocation =
  | "Rewards Dashboard"
  | "Single Investment"
  | "Send Money"
  | "Loan Screen"
  | "Connect";

export type Banner = {
  id: string;
  createdDate: string;
  imageUrl: string;
  imageAlt: string;
  heading: string;
  subHeading: string;
  link: string;
  screenLocation: ScreenLocation;
  sort: number;
  type: BannerType;
  status: BannerStatus;
  numberOfClicks?: number;
  clicksPerDay?: number;
};

export const mockBanners: Banner[] = [
  {
    id: "1",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Recharge & Win Promo!!",
    heading: "Black Friday Sale",
    subHeading: "Up to 50% off on all items",
    link: "https://sujimotonig.atlassian.net/jira/software/projects/MD/boards/8?selectedIssue=MD-106",
    screenLocation: "Rewards Dashboard",
    sort: 1,
    type: "In-page",
    status: "Active Ad",
    numberOfClicks: 120000123,
    clicksPerDay: 2000,
  },
  {
    id: "2",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Refer & Earn N1,000",
    heading: "New Arrivals",
    subHeading: "Check out our latest products",
    link: "https://sujimotonig.atlas...",
    screenLocation: "Single Investment",
    sort: 2,
    type: "Full-Page",
    status: "Active Ad",
  },
  {
    id: "3",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Recharge & Win Promo!!",
    heading: "Black Friday Sale",
    subHeading: "Up to 50% off on all items",
    link: "https://sujimotonig.atlassian.net/jira/software/projects/MD/boards/8?selectedIssue=MD-106",
    screenLocation: "Send Money",
    sort: 3,
    type: "In-page",
    status: "Active Ad",
    numberOfClicks: 120000123,
    clicksPerDay: 2000,
  },
  {
    id: "4",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Refer & Earn N1,000",
    heading: "New Arrivals",
    subHeading: "Check out our latest products",
    link: "https://sujimotonig.atlas...",
    screenLocation: "Loan Screen",
    sort: 4,
    type: "Full-Page",
    status: "Inactive Ad",
  },
  {
    id: "5",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Recharge & Win Promo!!",
    heading: "Black Friday Sale",
    subHeading: "Up to 50% off on all items",
    link: "https://sujimotonig.atlas...",
    screenLocation: "Connect",
    sort: 3,
    type: "Full-Page",
    status: "Inactive Ad",
  },
  {
    id: "6",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Refer & Earn N1,000",
    heading: "New Arrivals",
    subHeading: "Check out our latest products",
    link: "https://sujimotonig.atlas...",
    screenLocation: "Single Investment",
    sort: 2,
    type: "Full-Page",
    status: "Inactive Ad",
  },
  {
    id: "7",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Recharge & Win Promo!!",
    heading: "Black Friday Sale",
    subHeading: "Up to 50% off on all items",
    link: "https://sujimotonig.atlassian.net/jira/software/projects/MD/boards/8?selectedIssue=MD-106",
    screenLocation: "Send Money",
    sort: 2,
    type: "Full-Page",
    status: "Active Ad",
    numberOfClicks: 120000123,
    clicksPerDay: 2000,
  },
  {
    id: "8",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Refer & Earn N1,000",
    heading: "New Arrivals",
    subHeading: "Check out our latest products",
    link: "https://sujimotonig.atlas...",
    screenLocation: "Loan Screen",
    sort: 2,
    type: "In-page",
    status: "Active Ad",
  },
  {
    id: "9",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Recharge & Win Promo!!",
    heading: "Black Friday Sale",
    subHeading: "Up to 50% off on all items",
    link: "https://sujimotonig.atlas...",
    screenLocation: "Send Money",
    sort: 3,
    type: "In-page",
    status: "Active Ad",
  },
  {
    id: "10",
    createdDate: "Apr 12, 2023 | 09:32AM",
    imageUrl: "/placeholder.png",
    imageAlt: "Refer & Earn N1,000",
    heading: "New Arrivals",
    subHeading: "Check out our latest products",
    link: "https://sujimotonig.atlas...",
    screenLocation: "Single Investment",
    sort: 2,
    type: "In-page",
    status: "Inactive Ad",
  },
];

