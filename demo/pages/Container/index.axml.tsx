import { View, Page } from 'tsxml';
import Container from '../../../src/Container/index.axml';
import Icon from '../../../src/Icon/index.axml';

export default () => (
  <Page>
    <Container title="标题">
      <View class="content"></View>
    </Container>
    <Container headerInBox={false}>
      <View slot="title">
        <View class="icon">
          <Icon type="SmileOutline" style="margin-right: 8px" />
          标题
        </View>
      </View>
      <View slot="headerRight">右侧内容</View>
      <View class="content"></View>
    </Container>
    <Container title="标题">
      <View slot="headerRight">右侧内容</View>
      <View class="content">
        <View class="box"></View>
        <View class="box"></View>
        <View class="box"></View>
      </View>
    </Container>
    <Container>
      <View class="content"></View>
      <View slot="headerRight">右侧内容</View>
    </Container>
    <Container>
      <View class="content"></View>
    </Container>
  </Page>
);
