<template>
  <div class="calculator">
    <div class="expression">
      <section v-for="(it, i) in expression" :key="i" :class="{ 'invalid': !verifyValidity(it, i) }" class="element">
        <template v-if="it.type === 'fraction'">
          <input v-model.number="it.numerator" type="number" />
          <hr>
          <input v-model.number="it.denominator" type="number" />
        </template>

        <template v-if="it.type === 'operator'">
          <select v-model="it.value">
            <option v-for="operator in operators" :key="operator.value" :value="operator.value">{{ operator.value }}</option>
          </select>
        </template>
      </section>

      <section class="element">=</section>

      <section class="element">
        <input :value="result.numerator" readonly />
        <hr>
        <input :value="result.denominator" readonly />
      </section>
    </div>

    <div>
      <button @click="addFraction">Add fraction</button>
    </div>
  </div>
</template>

<script>
const EXPRESSION_TYPE_OPERATOR = 'operator'
const EXPRESSION_TYPE_FRACTION = 'fraction'

export default {
  name: 'calculator',
  data() {
    return {
      expression: [
        {
          type: EXPRESSION_TYPE_FRACTION,
          numerator: 1,
          denominator: 1
        }
      ],
      operators: [
        {
          value: '+',
          priority: 1,
          calculate(a, b) {
            return {
              numerator:
                a.numerator * b.denominator + b.numerator * a.denominator,
              denominator: a.denominator * b.denominator
            }
          }
        },
        {
          value: '−',
          priority: 1,
          calculate(a, b) {
            return {
              numerator:
                a.numerator * b.denominator - b.numerator * a.denominator,
              denominator: a.denominator * b.denominator
            }
          }
        },
        {
          value: '×',
          priority: 2,
          calculate(a, b) {
            return {
              numerator: a.numerator * b.numerator,
              denominator: a.denominator * b.denominator
            }
          }
        },
        {
          value: '÷',
          priority: 2,
          calculate(a, b) {
            return {
              numerator: a.numerator * b.denominator,
              denominator: a.denominator * b.numerator
            }
          }
        }
      ]
    }
  },
  computed: {
    result() {
      return this.calculate(this.expression.slice())
    }
  },
  methods: {
    addFraction() {
      const operator = {
        type: EXPRESSION_TYPE_OPERATOR,
        value: this.operators[0].value
      }
      const fraction = {
        type: EXPRESSION_TYPE_FRACTION,
        numerator: 1,
        denominator: 1
      }
      this.expression.push(operator, fraction)
    },
    calculate(expression) {
      const priorities = this.operators.map(it => it.priority)
      const priorityMin = Math.min(...priorities)
      const priorityMax = Math.max(...priorities)

      for (let priority = priorityMax; priority >= priorityMin; priority--) {
        for (let i = 0; i < expression.length; i++) {
          if (expression[i].type !== EXPRESSION_TYPE_OPERATOR) continue
          const operator = this.operators.find(
            it => it.value === expression[i].value
          )
          if (operator.priority !== priority) continue

          const fraction = operator.calculate(
            expression[i - 1],
            expression[i + 1]
          )
          const GCD = this.findGCD(fraction.numerator, fraction.denominator)

          fraction.numerator /= GCD
          fraction.denominator /= GCD
          expression.splice(--i, 3, fraction)
        }
      }

      return expression[0]
    },
    findGCD(a, b) {
      a = Math.abs(a)
      b = Math.abs(b)
      if (!a || !b) return Math.max(a, b)
      while (a != b)
        if (a > b) a = a - b
        else b = b - a
      return a
    },
    verifyValidity(item, i) {
      if (item.type === EXPRESSION_TYPE_OPERATOR) {
        const operator = this.operators.find(it => it.value === item.value)
        const fraction = operator.calculate(
          this.expression[i - 1],
          this.expression[i + 1]
        )
        return this.verifyValidity(fraction)
      }

      return (
        item.numerator !== '' &&
        item.denominator !== '' &&
        item.denominator !== 0
      )
    }
  },
  created() {
    this.addFraction()
  }
}
</script>

<style scoped>
.expression {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}
.element {
  margin: 0.25rem;
}
.invalid {
  outline: 0.2rem solid red;
}
input {
  width: 5rem;
}
</style>
