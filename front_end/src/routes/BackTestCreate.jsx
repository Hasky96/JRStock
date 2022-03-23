import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackTestCreateForm from "../components/BackTestCreate/BackTestCreateForm";
import PageContainer from "../components/PageContainer";

export default function BackTestCreate() {
  return (
    <PageContainer>
      <BackTestCreateForm />
    </PageContainer>
  );
}
