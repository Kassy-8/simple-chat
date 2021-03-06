import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header.jsx';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100 d-flex flex-column">
      <Header />
      <Container fluid className="border h-100 my-4 overflow-auto">
        <Row className="h-100 align-items-center justify-content-center">
          <Col className="text-center">
            <span>{t('page404.message')}</span>
            <a href="/">{t('page404.link')}</a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Page404;
