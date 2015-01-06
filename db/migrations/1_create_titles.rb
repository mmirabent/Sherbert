Sequel.migration do
  change do
    create_table(:titles) do
      primary_key :id
      String :name
      String :title, :unique => true
      Integer :votes
    end
  end
end