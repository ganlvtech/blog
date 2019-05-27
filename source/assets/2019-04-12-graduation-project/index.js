var vm = new Vue({
  el: '#app',
  data() {
    return {
      R_g: 287.2,
      kappa: 1.4,
      substance: 28.96,
      q_V: 420,
      T_0: 130,
      p_0_MPa: 0.48,
      p_2_MPa: 0.11,
      phi: 0.96,
      psi: 0.84,
      l_1_D_1: 0.04,
      delta_l_m: 0.017,
      tau_N: 0.98,
      tau_1: 0.965,
      tau_2: 0.775,
      alpha_1__deg: 16,
      beta_1__deg: 90,
      beta_2__deg: 30.25,
      mu: 0.498,
      rho: 0.49,
      bar_u_1: 0.66,
      p_2_p_3: 1.04,
      Delta_l_Delta_1: 1.7
    };
  },
  filters: {
    round(val) {
      return val.toPrecision(5);
    },
    m_to_mm(val) {
      return 1000 * val;
    },
    rad_to_deg(val) {
      return val / Math.PI * 180;
    },
    deg_to_rad(val) {
      return val / 180 * Math.PI;
    },
    deg_to_minute(val) {
      return val * 60;
    }
  },
  computed: {
    q_m() {
      return this.q_V * 1.2927 / 3600;
    },
    p_0() {
      return this.p_0_MPa * 1e6;
    },
    p_2() {
      return this.p_2_MPa * 1e6;
    },
    alpha_1_() {
      return this.alpha_1__deg / 180 * Math.PI;
    },
    beta_1_() {
      return this.beta_1__deg / 180 * Math.PI;
    },
    beta_2_() {
      return this.beta_2__deg / 180 * Math.PI;
    },
    p_3() {
      return this.p_2 / this.p_2_p_3;
    },
    i_0() {
      return calcBypT(this.p_0, this.T_0).i;
    },
    s_0() {
      return calcBypT(this.p_0, this.T_0).s;
    },
    i_2s() {
      return calcByps(this.p_2, this.s_0).i;
    },
    i_2s_() {
      return calcByps(this.p_3, this.s_0).i;
    },
    h_s() {
      return this.i_0 - this.i_2s;
    },
    h_s_() {
      return this.i_0 - this.i_2s_;
    },
    c_s() {
      return Math.sqrt(2 * this.h_s_);
    },
    Z_0() {
      return calcBypT(this.p_0, this.T_0).Z;
    },
    h_1s() {
      return (1 - this.rho) * this.h_s_;
    },
    c_1() {
      return this.phi * Math.sqrt(2 * this.h_1s);
    },
    i_1s() {
      return this.i_0 - this.h_1s;
    },
    i_1() {
      return this.i_0 - Math.pow(this.phi, 2) * this.h_1s;
    },
    p_1() {
      return calcByis(this.i_1s, this.s_0).p;
    }, // 0.27886;
    T_1() {
      return calcBypi(this.p_1, this.i_1).T;
    }, // 112.65;
    Z_1() {
      return calcBypT(this.p_1, this.T_1).Z;
    }, // 0.95881
    rho_1() {
      return (this.p_1) / (this.Z_1 * this.R_g * this.T_1);
    },
    n() {
      return this.kappa / (this.kappa - Math.pow(this.phi, 2) * (this.kappa - 1));
    },
    c_ast() {
      return Math.sqrt(2 * this.Z_0 * this.R_g * this.T_0 * (this.kappa / (this.kappa - 1)) * ((this.n - 1) / (this.n + 1)));
    },
    sin_alpha_1__delta_sin_alpha_1_() {
      return (Math.pow(2 / (this.n + 1), 1 / (this.n - 1)) * Math.sqrt((this.n - 1) / (this.n + 1)))
        / (Math.pow(this.p_1 / this.p_0, 1 / this.n) * Math.sqrt(1 - Math.pow(this.p_1 / this.p_0, (this.n - 1) / this.n)));
    },
    sin_alpha_1__delta() {
      return this.sin_alpha_1__delta_sin_alpha_1_ * Math.sin(this.alpha_1_);
    },
    alpha_1() {
      return Math.asin(this.sin_alpha_1__delta);
    },
    delta() {
      return Math.asin(this.sin_alpha_1__delta) - this.alpha_1_;
    },
    c_1_() {
      return Math.sqrt(this.n * this.Z_1 * this.R_g * this.T_1);
    },
    Ma_c1() {
      return this.c_1 / this.c_1_;
    },
    q_N() {
      return (1 - Math.pow(this.phi, 2)) * this.h_1s;
    },
    xi_N() {
      return this.q_N / this.h_s_;
    },
    rho_ast() {
      return Math.pow(2 / (this.n + 1), 1 / (this.n - 1)) * this.p_0 / (this.Z_0 * this.R_g * this.T_0);
    },
    u_1() {
      return this.bar_u_1 * this.c_s;
    },
    u_2m() {
      return this.mu * this.u_1;
    },
    tan_beta_1() {
      return Math.sin(this.alpha_1) / (Math.cos(this.alpha_1) - this.u_1 / this.c_1);
    },
    beta_1_raw() {
      return Math.atan(this.tan_beta_1);
    },
    beta_1() {
      return Math.PI + this.beta_1_raw;
    },
    w_1() {
      return this.c_1 * Math.sin(this.alpha_1) / Math.sin(this.beta_1);
    },
    w_1u() {
      return this.c_1 * Math.cos(this.alpha_1) - this.u_1;
    },
    w_1r() {
      return this.c_1 * Math.sin(this.alpha_1);
    },
    Ma_w_1() {
      return this.w_1 / this.c_1_;
    },
    q_w_u1() {
      return Math.pow(this.w_1u, 2) / 2;
    },
    i_1_() {
      return this.i_1 + this.q_w_u1;
    },
    s_1() {
      return calcBypi(this.p_1, this.i_1).s;
    },
    i_2s__() {
      return calcByps(this.p_3, this.s_1).i;
    },
    h_2s() {
      return this.i_1 - this.i_2s__;
    },
    w_2s() {
      return Math.sqrt(2 * this.h_2s + Math.pow(this.w_1r, 2) + Math.pow(this.u_2m, 2) - Math.pow(this.u_1, 2));
    },
    w_2() {
      return this.psi * this.w_2s;
    },
    q_r() {
      return 0.5 * (Math.pow(this.w_2s, 2) - Math.pow(this.w_2, 2));
    },
    xi_r() {
      return this.q_r / this.h_s_;
    },
    i_2() {
      return this.i_2s__ + this.q_r;
    },
    T_2() {
      return calcBypi(this.p_2, this.i_2).T;
    },
    Z_2() {
      return calcBypi(this.p_2, this.i_2).Z;
    },
    rho_2() {
      return this.p_2 / (this.Z_2 * this.R_g * this.T_2);
    },
    tan_alpha_2() {
      return Math.sin(this.beta_2_) / (Math.cos(this.beta_2_) - this.u_2m / this.w_2);
    },
    alpha_2() {
      return Math.atan(this.tan_alpha_2);
    },
    c_2() {
      return this.w_2 * Math.sin(this.beta_2_) / Math.sin(this.alpha_2);
    },
    q_K() {
      return Math.pow(this.c_2, 2) / 2;
    },
    xi_K() {
      return this.q_K / this.h_s_;
    },
    eta_u() {
      return 1 - this.xi_N - this.xi_r - this.xi_K;
    },
    D_1_raw() {
      return Math.sqrt(this.q_m / (Math.PI * this.l_1_D_1 * this.w_1 * Math.sin(this.beta_1) * this.rho_1 * this.tau_1));
    },
    D_1() {
      return Math.round(this.D_1_raw * 100) / 100;
    },
    l_1_D_1_round() {
      return this.q_m / (Math.PI * Math.pow(this.D_1, 2) * this.w_1 * Math.sin(this.beta_1) * this.rho_1 * this.tau_1);
    },
    Delta_1() {
      return 0.0005;
    },
    D_N() {
      return this.D_1 + 2 * this.Delta_1;
    },
    Z_N() {
      return 23;
    },
    b_N() {
      return Math.PI * this.D_N / this.Z_N * this.tau_N * Math.sin(this.alpha_1_);
    },
    l_N() {
      return this.q_m / (this.rho_ast * this.c_ast * this.b_N * this.Z_N);
    },
    Delta_l() {
      return this.Delta_l_Delta_1 * this.Delta_1;
    },
    l_1() {
      return this.l_N + this.Delta_l;
    },
    l_1_D_1_calculated() {
      return this.l_1 / this.D_1;
    },
    D_2m() {
      return this.mu * this.D_1;
    },
    A_2() {
      return this.q_m / (this.w_2 * Math.sin(this.beta_2_) * this.rho_2 * this.tau_2);
    },
    D_2__() {
      return Math.sqrt(Math.pow(this.D_2m, 2) - 2 * this.A_2 / Math.PI);
    },
    k_r() {
      return this.D_2__ / this.D_1;
    },
    D_2_() {
      return Math.sqrt(Math.pow(this.D_2m, 2) + 2 * this.A_2 / Math.PI);
    },
    l_2() {
      return (this.D_2_ - this.D_2__) / 2;
    },
    l_m() {
      return (this.l_1 + this.l_2) / 2;
    },
    delta_() {
      return 0.0004;
    },
    delta_l_m() {
      return this.delta_ / this.l_m;
    },
    theta() {
      return Math.atan(2 * (this.l_2 - this.l_1) / (this.D_1 - this.D_2m));
    },
    eta_1() {
      return calcBypT(this.p_1, this.T_1).eta;
    },
    nu_1() {
      return this.eta_1 / this.rho_1;
    },
    Re() {
      return this.u_1 * this.D_1 / this.nu_1;
    },
    zeta_f() {
      return 12.87 / 1e3 / Math.pow(this.Re, 1 / 5);
    },
    K() {
      return 4;
    },
    P_B() {
      return this.K * this.zeta_f * this.rho_1 * Math.pow(this.u_1, 3) * Math.pow(this.D_1, 2);
    },
    q_B() {
      return this.P_B / this.q_m;
    },
    xi_B() {
      return this.q_B / (this.h_s_);
    },
    xi_l() {
      return 1.3 * this.delta_l_m * (this.eta_u - this.xi_B);
    },
    q_l() {
      return this.xi_l * this.h_s_;
    },
    eta_s_() {
      return 1 - (this.xi_N + this.xi_r + this.xi_K + this.xi_l);
    },
    i_2_() {
      return this.i_2 + this.q_B + this.q_l;
    },
    i_4() {
      return this.i_2_;
    },
    T_2_() {
      return calcBypi(this.p_3, this.i_2_).T;
    },
    T_4() {
      return this.T_2_;
    },
    Z_2_() {
      return this.Z_2;
    },
    c_3_estimate() {
      return 7.5;
    },
    n_1_n_estimate() {
      return Math.log((Math.pow(this.c_2, 2) - Math.pow(this.c_3_estimate, 2)) /
        (2 * this.kappa / (this.kappa - 1) * this.Z_2_ * this.R_g * this.T_2_) + 1) / Math.log(this.p_2_p_3);
    },
    eta_K_raw() {
      return (this.kappa - 1) / this.kappa / this.n_1_n_estimate;
    },
    eta_K() {
      return Math.round(this.eta_K_raw * 100) / 100;
    },
    n_1_n() {
      return 1 / this.eta_K * (this.kappa - 1) / this.kappa;
    },
    n_() {
      return 1 / (1 - this.n_1_n);
    },
    c_3_() {
      return Math.sqrt(Math.pow(this.c_2, 2) - 2 * this.kappa / (this.kappa - 1) * this.Z_2_ * this.R_g * this.T_2_ * (Math.pow(this.p_2_p_3, this.n_1_n) - 1));
    },
    rho_3_() {
      return Math.pow(this.p_2 / this.p_3, 1 / this.n_) * this.rho_2;
    },
    rho_5() {
      return this.rho_3_;
    },
    T_3_() {
      return Math.pow(this.p_2 / this.p_3, (this.n_ - 1) / this.n_) * this.T_2_;
    },
    T_5() {
      return this.T_3_;
    },
    i_3_() {
      return calcBypT(this.p_2, this.T_3_).i;
    },
    i_5() {
      return this.i_3_;
    },
    rho_2_() {
      return this.p_3 / (this.Z_2_ * this.R_g * this.T_2_);
    },
    i_5_verify() {
      return this.i_2 + this.q_B + this.q_K + this.q_l;
    },
    D_K() {
      return this.D_2_;
    },
    d() {
      return this.D_2__;
    },
    D_3() {
      return Math.sqrt(4 * this.q_m / (Math.PI * this.c_3_ * Math.sin(this.alpha_2) * this.rho_3_));
    },
    alpha_K() {
      return 8 / 180 * Math.PI;
    },
    L() {
      return (this.D_3 - this.D_K) / (2 * Math.tan(this.alpha_K));
    },
    eta_s() {
      return (this.i_0 - this.i_5) / (this.i_0 - this.i_2s);
    },
    Q_0() {
      return this.eta_s * this.h_s * this.q_m;
    },
    P_T() {
      return this.eta_s * 0.96 * this.h_s * this.q_m;
    },
    n_rotation() {
      return 60 * this.u_1 / (Math.PI * this.D_1);
    },
    t_N() {
      return Math.PI * this.D_N / this.Z_N;
    },
    l_N_() {
      return 0.6;
    },
    b() {
      return this.t_N / this.l_N_;
    },
    R_N() {
      return this.D_N / 2;
    },
    D_0() {
      return 0;
    }
  }
});
