import ProtectedLayout from "@/app/(protected)/ProtectedLayout";
// import Navbar from "@/components/Navbar";

export default function ProtectedRouteLayout({ children }) {
  return <ProtectedLayout>
    {/* <Navbar /> */}
    {children}</ProtectedLayout>;
}
