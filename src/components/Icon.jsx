import Search2Line from "~icons/ri/search-2-line";
import ArrowDropDownLine from "~icons/ri/arrow-drop-down-line";
import ArrowDownLongLine from "~icons/ri/arrow-down-long-line";
import Book2Line from "~icons/ri/book-2-line";
import Menu4Line from "~icons/ri/menu-4-line";
import BallPenLine from "~icons/ri/ball-pen-line";
import Message3Line from "~icons/ri/message-3-line";
import Robot2Line from "~icons/ri/robot-2-line";
import UserLine from "~icons/ri/user-line";
import VerifiedBadgeLine from "~icons/ri/verified-badge-line";
import CloseCircleLine from "~icons/ri/close-circle-line";
import PenNibLine from "~icons/ri/pen-nib-line";
import MoonLine from "~icons/ri/moon-line";
import SunLine from "~icons/ri/sun-line";
import CloseLine from "~icons/ri/close-line";
import MenuLine from "~icons/ri/menu-line";
import MailLine from "~icons/ri/mail-line";
import Lock2Line from "~icons/ri/lock-2-line";
import LockPasswordLine from "~icons/ri/lock-password-line";
import MailCheckLine from "~icons/ri/mail-check-line";
import ErrorWarningLine from "~icons/ri/error-warning-line";
import ArrowLeftLine from "~icons/ri/arrow-left-line";
import EditLine from "~icons/ri/edit-line";
import CheckLine from "~icons/ri/check-line";
import LogoutBoxRLine from "~icons/ri/logout-box-r-line";
import DeleteBinLine from "~icons/ri/delete-bin-line";
import ArrowRightUpLine from "~icons/ri/arrow-right-up-line";

const ICONS = {
  "ri:search-2-line": Search2Line,
  "ri:arrow-drop-down-line": ArrowDropDownLine,
  "ri:arrow-down-long-line": ArrowDownLongLine,
  "ri:book-2-line": Book2Line,
  "ri:menu-4-line": Menu4Line,
  "ri:ball-pen-line": BallPenLine,
  "ri:message-3-line": Message3Line,
  "ri:robot-2-line": Robot2Line,
  "ri:user-line": UserLine,
  "ri:verified-badge-line": VerifiedBadgeLine,
  "ri:close-circle-line": CloseCircleLine,
  "ri:pen-nib-line": PenNibLine,
  "ri:moon-line": MoonLine,
  "ri:sun-line": SunLine,
  "ri:close-line": CloseLine,
  "ri:menu-line": MenuLine,
  "ri:mail-line": MailLine,
  "ri:lock-2-line": Lock2Line,
  "ri:lock-password-line": LockPasswordLine,
  "ri:mail-check-line": MailCheckLine,
  "ri:error-warning-line": ErrorWarningLine,
  "ri:arrow-left-line": ArrowLeftLine,
  "ri:edit-line": EditLine,
  "ri:check-line": CheckLine,
  "ri:logout-box-r-line": LogoutBoxRLine,
  "ri:delete-bin-line": DeleteBinLine,
  "ri:arrow-right-up-line": ArrowRightUpLine,
};

export function Icon({ icon, ...props }) {
  const Cmp = ICONS[icon];
  return Cmp ? <Cmp {...props} /> : null;
}
