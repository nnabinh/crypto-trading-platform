import Layout from '@/components/Layout';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeLayout() {
  return (
    <Layout>
      <StatusBar style="light" />
      <Slot />
    </Layout>
  );
}
