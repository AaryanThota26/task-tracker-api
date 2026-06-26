import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useState, useEffect, useTransition } from "react";
import NewTaskModal from "./NewTaskModal";

function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}

export default function Layout({
  children,
  title,
  onTaskCreated,
  editTask = null,
  onEditClose,
}) {
  const [showModal, setShowModal] = useState(false);

  const [, startTransition] = useTransition();
  useEffect(() => {
    if (editTask) {
      startTransition(() => setShowModal(true));
    }
  }, [editTask]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        onNewTask={() => {
          if (editTask && onEditClose) onEditClose();
          setShowModal(true);
        }}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isMobile={isMobile}
        isTablet={isTablet}
        isDesktop={isDesktop}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto md:ml-[80px] lg:ml-[260px]">
        <TopBar
          title={title}
          onMenuClick={() => setMobileOpen(true)}
          isMobile={isMobile}
          isTablet={isTablet}
        />
        <div className="flex-1 relative">
          {children}
        </div>
      </main>
      {showModal && (
        <NewTaskModal
          task={editTask}
          onClose={() => {
            if (editTask && onEditClose) onEditClose();
            setShowModal(false);
          }}
          onCreated={() => {
            if (editTask && onEditClose) onEditClose();
            setShowModal(false);
            if (onTaskCreated) onTaskCreated();
          }}
        />
      )}
    </div>
  );
}
