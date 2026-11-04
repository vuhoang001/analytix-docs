import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const CATEGORIES = [
  {
    href: '/tutorials/',
    icon: '🧭',
    title: 'Bắt đầu',
    description: 'Bạn mới dùng AnalytiX. Dắt tay từng bước, cuối bài có kết quả tự kiểm được.',
  },
  {
    href: '/how-to/',
    icon: '🛠️',
    title: 'Làm một việc cụ thể',
    description: 'Bạn đã cài xong, giờ cần công thức: thêm driver, nhúng báo cáo, đóng gói bản phát hành.',
  },
  {
    href: '/reference/',
    icon: '📖',
    title: 'Tra bảng và tham số',
    description: 'Bạn đã biết tên thứ cần tìm — biến môi trường, tham số, mã lỗi.',
  },
  {
    href: '/explanation/',
    icon: '💡',
    title: 'Hiểu vì sao',
    description: 'Bạn muốn biết AnalytiX đánh đổi những gì, và vì sao nó làm thế.',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          Nền tảng kho dữ liệu và báo cáo tập trung — từ nạp dữ liệu đến
          dashboard chia sẻ ra ngoài.
        </p>
        <Link className="button button--primary button--lg" to="/tutorials/cai-dat-analytix">
          Bắt đầu nhanh: cài AnalytiX →
        </Link>
      </div>
    </header>
  );
}

function CategoryCards() {
  return (
    <section className={styles.categories}>
      <div className="container">
        <div className="row">
          {CATEGORIES.map((c) => (
            <div key={c.href} className="col col--3">
              <Link to={c.href} className={styles.card}>
                <div className={styles.cardIcon}>{c.icon}</div>
                <Heading as="h3">{c.title}</Heading>
                <p>{c.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <CategoryCards />
      </main>
    </Layout>
  );
}
