<template>
  <div class='UserLoginView' :class='$style.UserLoginView'>
    <div :class='$style.leftSide'>
      <div :class='$style.BrandLogo'>
        <BrandIcon :class='$style.icon' />
        <div>Stronger Things</div>
      </div>
    </div>
    <div :class='$style.rightSide'>
      <div>
        <h1>Log In</h1>
        <form @submit.prevent='submit'>
          <label :class='$style.label'>Username</label>
          <InputField v-model.trim='user.username' :class='$style.input' placeholder='Username' />
          <label :class='$style.label'>Password</label>
          <InputField v-model.trim='user.password' :class='$style.input' type='password' placeholder='Password' />
          <AppButton :loading='loading' :class='$style.submit'>
            Login
            <template slot='loading'>Submitting...</template>
          </AppButton>
          <router-link :to='{ name: "UserRegistrationView"}'>Not a member? Register here</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppButton from "@/components/AppButton.vue";
import InputField from "@/components/InputField.vue";
import BrandIcon from "@/assets/brand-icon-plain.svg";
import Parse from "@/services/Parse";

@Component({
  components: {
    AppButton,
    InputField,
    BrandIcon
  }
})
export default class UserLoginView extends Vue {
  // @Prop() private msg!: string;
  user = {};
  loading = false;

  async login({ username = "", password = "" } = {}) {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      const user = await this.$store.dispatch("sessions/login", {
        username,
        password
      });
      // const user = await Parse.User.logIn(username, password);
      this.$notify({
        group: "main",
        type: "success",
        title: "Successfully Logged In",
        text: `Welcome, ${username}!`
      });
      this.$router.push("/");
    } catch (e) {
      this.$notify({
        group: "main",
        type: "error",
        title: "Error Logging In",
        text: e.message
      });
    } finally {
      this.loading = false;
    }
  }

  submit() {
    this.login(this.user);
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.BrandLogo {
  text-align: center;
  color: $color-white;
  font-size: 2em;
  text-transform: uppercase;
  letter-spacing: 8px;
  font-weight: 300;
}

.icon {
  width: 300px;
  margin-right: 8px;
}

.UserLoginView {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.leftSide {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // background-color: $color-black-charcoal;
  background: rgb(42, 50, 54);
  background: linear-gradient(
    180deg,
    rgba(42, 50, 54, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}

.rightSide {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.label {
  display: block;
  margin-bottom: 4px;
}

.input {
  width: 300px;
  margin-bottom: 16px;
}

.submit {
  margin-bottom: 12px;
}
</style>
