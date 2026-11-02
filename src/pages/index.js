import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const CATEGORIES = [
  {
    href: '/tutorials/',
    icon: '🧭',
    title: 'Học theo hướng dẫn',
    description: 'Bạn mới dùng AnalytiX, muốn làm theo từng bước có kết quả cụ thể.',
  },
  {
    href: '/how-to/',
    icon: '🛠️',
    title: 'Cách làm',
    description: 'Bạn đã biết AnalytiX, cần công thức cho một việc cụ thể.',
  },
  {
    href: '/reference/',
    icon: '📖',
    title: 'Tra cứu',
    description: 'Bạn cần tra một bảng, một mã lỗi, một tham số.',
  },
  {
    href: '/explanation/',
    icon: '💡',
    title: 'Giải thích',
    description: 'Bạn muốn hiểu vì sao AnalytiX hoạt động theo cách nó đang hoạt động.',
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
          Bắt đầu: Cài AnalytiX lần đầu →
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
