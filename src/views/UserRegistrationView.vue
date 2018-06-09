<template>
  <div class='UserRegistrationView' :class='$style.UserRegistrationView'>
    <div :class='$style.leftSide'>
      <div :class='$style.BrandLogo'>
        <BrandIcon :class='$style.icon' />
        <div>Stronger Things</div>
      </div>
    </div>
    <div :class='$style.rightSide'>
      <div>
        <h1>Sign Up</h1>
        <form @submit.prevent='submit'>
          <label :class='$style.label'>Username</label>
          <InputField v-model.trim='user.username' :class='$style.input' placeholder='Username' />
          <label :class='$style.label'>Password</label>
          <InputField v-model.trim='user.password' :class='$style.input' type='password' placeholder='Password' />
          <AppButton :loading='loading' :class='$style.submit'>
            Register
            <template slot='loading'>Submitting...</template>
          </AppButton>
          <router-link :to='{ name: "UserLoginView"}'>Already registered? Login here</router-link>
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
export default class UserRegistrationView extends Vue {
  user = {};
  loading = false;

  async register({ username = "", password = "" } = {}) {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      const res = await this.$store.dispatch("sessions/register", {
        username,
        password
      });
      // const res = await user.signUp();
      this.$notify({
        group: "main",
        type: "success",
        title: "Successfully Registered",
        text: `Welcome to Stronger Things!`
      });
      this.$router.push("/");
    } catch (e) {
      this.$notify({
        group: "main",
        type: "error",
        title: "Error with Registration",
        text: e.message
      });
    } finally {
      this.loading = false;
    }
  }

  submit() {
    this.register(this.user);
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

.UserRegistrationView {
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
